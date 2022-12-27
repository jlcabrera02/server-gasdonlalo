import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
    em.idempleado,
    CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) AS nombre_completo,
    ch.isla_limpia,
    ch.aceites_completos,
    ch.fecha as fecha_db
FROM
    (SELECT 
        *
    FROM
        empleado
    WHERE
        estatus = 1 AND iddepartamento = 1) AS em
        LEFT OUTER JOIN
    (SELECT 
        *
    FROM
        checklist_bomba
    WHERE
        fecha = ?) AS ch ON ch.idempleado_entrante = em.idempleado`;

    connection.query(sql, fecha, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * from checklist_bomba WHERE idchecklist_bomba = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO checklist_bomba SET ?";

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE checklist_bomba SET ? WHERE idchecklist_bomba = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM checklist_bomba WHERE idchecklist_bomba = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
