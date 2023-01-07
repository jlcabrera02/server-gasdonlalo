import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM solicitud_empleo";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSolicitud = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM solicitud_empleo WHERE idsolicitud_empleo = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1)
        return reject(sinRegistro("No existe la solicitud de empleo"));
      if (res) return resolve(res[0]);
    });
  });

model.findXEstatus = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM solicitud_empleo WHERE estatus = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO solicitud_empleo SET `fecha_registro` = CURRENT_TIMESTAMP, ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE solicitud_empleo SET ? WHERE idsolicitud_empleo = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
