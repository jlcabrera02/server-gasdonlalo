import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

model.find = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT em.idempleado, CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) AS nombre_completo, ch.isla_limpia, ch.aceites_completos, ch.fecha as fecha_db, CASE WHEN (COUNT(em.idempleado) * 2) =  SUM(isla_limpia + aceites_completos) THEN 1 ELSE 0 END AS cumple FROM (SELECT * FROM empleado WHERE estatus = 1 AND iddepartamento = 1) AS em LEFT OUTER JOIN (SELECT * FROM checklist_bomba WHERE fecha = ?) AS ch ON ch.idempleado_entrante = em.idempleado GROUP BY em.idempleado ORDER BY nombre_completo`;

    connection.query(sql, fecha, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.totalChecks = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.*, SUM(ch.cumple) total_checklist FROM (SELECT *, CONCAT(nombre, " ", apellido_paterno, " ", apellido_materno) AS nombre_completo FROM empleado WHERE iddepartamento = 1 AND date_baja IS NULL OR date_baja > ?) emp  LEFT JOIN (SELECT *, CASE WHEN (COUNT(idempleado_entrante) * 2) =  SUM(isla_limpia + aceites_completos) THEN 1 ELSE 0 END AS cumple FROM checklist_bomba WHERE fecha BETWEEN ? AND LAST_DAY(?)  GROUP BY idempleado_entrante, fecha) ch  ON emp.idempleado = ch.idempleado_entrante GROUP BY emp.idempleado ORDER BY emp.nombre`;

    connection.query(sql, [fecha, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.validarExistencia = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM checklist_bomba WHERE fecha = ? AND idempleado_entrante = ? AND idbomba = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false);
      if (res) return reject(datosExistentes());
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO checklist_bomba SET ?";

    connection.query(sql, data, (err, res) => {
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
