import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.liquidacionesPendientes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM liquidaciones lq, horarios hr, empleado emp, turno t WHERE lq.folio = hr.idhorario AND emp.idempleado = hr.idempleado AND t.idturno = hr.idturno  AND hr.fechaliquidacion = ?";

    connection.query(sql, fecha, (err, res) => {
      if (err) return reject(errorDB());
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.liquidacionByFolio = (folio) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM liquidaciones WHERE idliquidacion = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.generarFolios = (folio) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO liquidaciones (folio) VALUE (?)";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.capturarFolio = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE liquidaciones SET ? WHERE folio = ? ";

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.capturarVales = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO vales (monto, combustible, folio) VALUES ? ";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.capturarEfectivo = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO efectivo (monto, folio) VALUES ? ";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.deleteLiquido = (folio) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM liquidaciones WHERE folio = ?";

    connection.query(sql, folio, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
