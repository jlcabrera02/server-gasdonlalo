import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import { format } from "mysql2";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.lastFolio = (idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas_finales lcf, info_lecturas infl, mangueras mg, islas WHERE lcf.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND infl.idinfo_lectura = lcf.idinfo_lectura AND islas.idestacion_servicio = ?  ORDER BY lcf.idlectura DESC LIMIT 1";

    connection.query(sql, idEstacion, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(0);
      if (res) return resolve(res[0].folio);
    });
  });

model.lastFolioEstacion = (idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT lcf.* FROM lecturas_finales lcf, info_lecturas infl, mangueras mg, islas WHERE lcf.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND infl.idinfo_lectura = lcf.idinfo_lectura AND islas.idestacion_servicio = ? ORDER BY lcf.idlectura DESC LIMIT 1";

    connection.query(sql, idEstacion, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(0);
      if (res) return resolve(res[0].folio);
    });
  });

model.lecturasIniciales = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas_finales lcf, info_lecturas infl mangueras mg, islas WHERE lcf.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND islas.idestacion_servicio = ? AND infl.idinfo_lectura = lcf.idinfo_lectura AND infl.folio = ? ORDER BY lcf.folio DESC";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.lecturasByIdLiquidacion = (folio) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas_finales lecf, info_lecturas infl WHERE infl.idinfo_lectura = lcf.idinfo_lectura AND infl.idliquidacion = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insertLecturasFinales = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO lecturas_finales (idmanguera, lectura, fecha, idliquidacion) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1)
        return reject(
          sinCambios("No se establecio una configuración inicial previa")
        );
      if (res) return resolve(res);
    });
  });

model.insertLecturas = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO lecturas (manguera, lecturaInicial, lecturaFinal, precio, folio) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateLecturaInicial = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((el) => {
      sql += format(
        "UPDATE lecturas_finales SET lectura =  ?, updatedAt = CURRENT_TIME WHERE folio = ? AND idmanguera = ?; ",
        el
      );
    });

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.deleteLecturaInicial = (folio) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM lecturas_finales WHERE folio = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });
export default model;
