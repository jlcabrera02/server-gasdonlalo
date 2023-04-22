import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import { format } from "mysql2";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.lastFolio = (idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas_iniciales lci, mangueras mg, islas WHERE lci.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND islas.idestacion_servicio = ?  ORDER BY folio DESC LIMIT 1";

    connection.query(sql, idEstacion, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(0);
      if (res) return resolve(res[0].folio);
    });
  });

model.lastFolioEstacion = (idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT lci.* FROM lecturas_iniciales lci, mangueras mg, islas WHERE lci.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND islas.idestacion_servicio = ? ORDER BY folio DESC LIMIT 1";

    connection.query(sql, idEstacion, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(0);
      if (res) return resolve(res[0].folio);
    });
  });

model.lecturasIniciales = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas_iniciales lci, mangueras mg, islas WHERE lci.idmanguera = mg.idmanguera AND mg.idisla = islas.idisla AND islas.idestacion_servicio = ? AND lci.folio = ? ORDER BY lci.folio DESC";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.lecturasByFolio = (folio) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM lecturas_iniciales WHERE folio = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insertLecturasIniciales = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO lecturas_iniciales (idmanguera, lectura, fecha, folio) VALUES ?";

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
        "UPDATE lecturas_iniciales SET lectura =  ?, updatedAt = CURRENT_TIME WHERE folio = ? AND idmanguera = ?; ",
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
    let sql = "DELETE FROM lecturas_iniciales WHERE folio = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });
export default model;
