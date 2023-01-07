import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findTotalDocumentos = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT TA.idempleado, CONCAT(TA.nombre, " ", TA.apellido_paterno, " ", TA.apellido_materno) AS nombre_completo, TA.iddepartamento, TA.estatus, SUM(control_documento.cumple) AS num_documentos FROM (SELECT * FROM empleado, documento WHERE empleado.estatus != 0) AS TA LEFT JOIN control_documento ON TA.idempleado = control_documento.idempleado AND TA.iddocumento = control_documento.iddocumento GROUP BY TA.idempleado ORDER BY TA.idempleado`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findDocumentosXIdempleado = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM (SELECT TA.*, cd.idcontrol_documento, cd.cumple FROM (SELECT * FROM empleado, documento) AS TA LEFT JOIN control_documento AS cd ON TA.idempleado = cd.idempleado AND TA.iddocumento = cd.iddocumento) AS documents WHERE documents.idempleado = ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO control_documento SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM control_documento WHERE iddocumento = ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });
0;

export default model;
