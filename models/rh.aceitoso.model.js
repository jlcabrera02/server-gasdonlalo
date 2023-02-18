import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

const model = {};

model.find = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT SELECT vl.*, emp.*,  es.nombre as estacion_servicio FROM venta_aceite vl, empleado emp, estacion_servicio es WHERE es.idestacion_servicio = vl.idestacion_servicio AND vl.idempleado = emp.idempleado AND vl.fecha BETWEEN ? AND LAST_DAY(?)`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.obtenerEmpleadosXRegistroXintervalo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.* FROM venta_aceite va, empleado emp WHERE va.idempleado = emp.idempleado AND va.idestacion_servicio = ? AND va.fecha BETWEEN ? AND ? GROUP BY emp.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.obtenerEmpleadosXRegistro = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.* FROM venta_aceite va, empleado emp WHERE va.idempleado = emp.idempleado AND va.idestacion_servicio = ? AND va.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findVentasAXestacion = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT va.idventa_aceite, va.fecha, va.idempleado, va.idestacion_servicio, SUM(va.cantidad) cantidad, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CASE WHEN SUM(va.descalificado) > 0 THEN true ELSE false END AS descalificado FROM venta_aceite va, empleado emp, estacion_servicio es WHERE emp.idempleado = va.idempleado AND es.idestacion_servicio = va.idestacion_servicio AND va.idempleado = ? AND va.idestacion_servicio = ? AND va.fecha = ? GROUP BY va.fecha, va.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findVentasA = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT va.idventa_aceite, va.fecha, va.idempleado, va.idestacion_servicio, SUM(va.cantidad) cantidad, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM venta_aceite va, empleado emp, estacion_servicio es WHERE emp.idempleado = va.idempleado AND es.idestacion_servicio = va.idestacion_servicio AND va.idempleado = ? AND va.fecha = ? GROUP BY va.fecha, va.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insertVentaAceite = (data) =>
  new Promise((resolve, reject) => {
    let sql = `INSERT INTO venta_aceite SET ?`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.delete = (idAceite) =>
  new Promise((resolve, reject) => {
    let sql = `DELETE FROM venta_aceite WHERE idventa_aceite = ?`;
    connection.query(sql, idAceite, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
