import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

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

model.findXMesXEmpleado = (fecha, idEmpleado) =>
  new Promise((resolve, reject) => {
    let sql;
    if (idEmpleado) {
      sql = mysql.format(
        `SELECT
      mf.idmonto_faltante,
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
      mf.idmonto_faltante,
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

//Utilizado para las evaluaciones quincenales
model.findXMesXEmpleadoEv = (data) =>
  new Promise((resolve, reject) => {
    let sql = mysql.format(
      `SELECT
      SUM(cantidad) total
      FROM
      monto_faltante
      WHERE
      fecha BETWEEN ? AND ? AND idempleado = ? GROUP BY idempleado`,
      data
    );

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.findXTiempo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT mf.idmonto_faltante, emp.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.iddepartamento,emp.nombre, emp.apellido_paterno, emp.apellido_materno, emp.estatus, mf.fecha, SUM(mf.cantidad) cantidad FROM monto_faltante AS mf, empleado AS emp WHERE mf.idempleado = emp.idempleado AND mf.fecha = ? AND emp.idempleado = ?  GROUP BY emp.idempleado ORDER BY emp.idempleado`;

    connection.query(sql, data, (err, res) => {
      console.log(data);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findOne = (
  idMf //Usada para actualizar
) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM monto_faltante WHERE idmonto_faltante = ?`;

    connection.query(sql, idMf, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
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
      console.log(res);
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
