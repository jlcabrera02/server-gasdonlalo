import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql =
      'SELECT CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) as nombre_completo, mf.* FROM monto_faltante as mf, empleado as em WHERE mf.idempleado = em.idempleado';

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXSemana = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
    em.idempleado,
    CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) AS nombre_completo,
    SUM(mf.cantidad) AS total,
    CASE
    WHEN DAY(fecha) < 7 THEN 1
    WHEN DAY(fecha) >= 7 AND DAY(fecha) <= 14 THEN 2
    WHEN DAY(fecha) >= 15 AND DAY(fecha) <= 21 THEN 3
    WHEN DAY(fecha) >= 22 AND DAY(fecha) <= 28 THEN 4
    WHEN DAY(fecha) >= 29 AND DAY(fecha) <= 31 THEN 5
    END AS semana
FROM
    monto_faltante AS mf,
    empleado AS em
WHERE
    fecha BETWEEN ? AND LAST_DAY(?) AND
    em.idempleado = mf.idempleado
GROUP BY mf.idempleado, semana ORDER BY semana`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findCantidadXMes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT SUM(cantidad) AS total_mes
FROM
    monto_faltante
WHERE
    fecha BETWEEN ? AND LAST_DAY(?)`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM monto_faltante WHERE idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXMesXEmpleado = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT
    em.idempleado,
	CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) AS nombre_completo,
    SUM(mf.cantidad) AS total_mes_empleado
FROM
    monto_faltante AS mf,
    empleado AS em
WHERE
    fecha BETWEEN ? AND LAST_DAY(?) AND
    em.idempleado = mf.idempleado
GROUP BY mf.idempleado`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO monto_faltante SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE monto_faltante SET ? WHERE idmonto_faltante = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM monto_faltante WHERE idmonto_faltante = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
