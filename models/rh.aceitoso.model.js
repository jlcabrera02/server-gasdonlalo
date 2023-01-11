import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

const model = {};

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
    let sql = `SELECT va.idventa_aceite, va.fecha, va.idempleado, va.idestacion_servicio, SUM(va.cantidad) cantidad, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM venta_aceite va, empleado emp, estacion_servicio es WHERE emp.idempleado = va.idempleado AND es.idestacion_servicio = va.idestacion_servicio AND va.idempleado = ? AND va.idestacion_servicio = ? AND va.fecha = ? GROUP BY va.fecha, va.idempleado`;
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

export default model;
