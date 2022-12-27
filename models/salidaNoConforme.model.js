import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findSalidasNoConformesXMes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT sn.*, inc.incumplimiento, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idincumplimiento = inc.idincumplimiento AND emp.idempleado = sn.idempleado AND sn.fecha BETWEEN ? AND LAST_DAY(?) ORDER BY sn.fecha DESC`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSalidasNoConformesXMesXIddepartamento = (fecha, id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT TABLEA.*, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_autoriza, emp.iddepartamento AS iddepartamento_autoriza FROM (SELECT sn.idsalida_noconforme, sn.fecha, sn.descripcion_falla, sn.acciones_corregir, sn.concesiones, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple, sn.idempleado_autoriza, emp.iddepartamento AS iddepartamento_incumple, sn.idempleado AS idempleado_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idempleado = emp.idempleado AND sn.idincumplimiento = inc.idincumplimiento AND sn.fecha BETWEEN ? AND LAST_DAY(?)) AS TABLEA, empleado emp WHERE TABLEA.idempleado_autoriza = emp.idempleado AND iddepartamento_incumple = ?`;

    connection.query(sql, [fecha, fecha, id], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT TABLEA.*, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_autoriza, emp.iddepartamento AS iddepartamento_autoriza FROM (SELECT sn.idsalida_noconforme, sn.fecha, sn.descripcion_falla, sn.acciones_corregir, sn.concesiones, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple, sn.idempleado_autoriza, emp.iddepartamento AS iddepartamento_incumple, sn.idempleado AS idempleado_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idempleado = emp.idempleado AND sn.idincumplimiento = inc.idincumplimiento) AS TABLEA, empleado emp WHERE TABLEA.idempleado_autoriza = emp.idempleado AND TABLEA.idsalida_noconforme = ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO salida_noconforme SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE salida_noconforme SET ? WHERE idsalida_noconforme = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM salida_noconforme WHERE idsalida_noconforme = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
