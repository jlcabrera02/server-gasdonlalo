import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
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

//Me obtiene todo los empleados que han tenido un monto faltante del mes --Importante para la obtencion de los montos faltantes por semanas
model.findEmpleadosXmes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.iddepartamento FROM monto_faltante AS mf, empleado AS emp WHERE mf.idempleado = emp.idempleado AND mf.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado ORDER BY emp.idempleado`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXSemana = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT SUM(mf.cantidad) AS total FROM monto_faltante AS mf WHERE mf.idempleado = ? AND mf.fecha BETWEEN ? AND ? GROUP BY mf.idempleado`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false); //Este false no se debe tocar porque es clave para la funcion
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

model.findXMesXEmpleado = (fecha, idEmpleado) =>
  new Promise((resolve, reject) => {
    let sql;
    if (idEmpleado) {
      sql = mysql.format(
        `SELECT
      em.idempleado,
      CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) AS nombre_completo,
      em.iddepartamento, 
      mf.fecha,
      mf.cantidad
      FROM
      monto_faltante AS mf,
      empleado AS em
      WHERE
      fecha BETWEEN ? AND LAST_DAY(?) AND
      em.idempleado = mf.idempleado AND em.idempleado = ?`,
        [fecha, fecha, idEmpleado]
      );
    } else {
      sql = mysql.format(
        `SELECT
      em.idempleado,
      em.nombre, 
      em.apellido_paterno,
      em.apellido_materno,
      SUM(mf.cantidad) AS total_mes_empleado
      FROM
      monto_faltante AS mf,
      empleado AS em
      WHERE
      fecha BETWEEN ? AND LAST_DAY(?) AND
      em.idempleado = mf.idempleado
      GROUP BY mf.idempleado ORDER BY em.nombre`,
        [fecha, fecha]
      );
    }

    connection.query(sql, (err, res) => {
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