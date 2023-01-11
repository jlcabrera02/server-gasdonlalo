import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

const model = {};

model.obtenerEmpleadosXRegistro = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.* FROM venta_litros vl, empleado emp WHERE vl.idempleado = emp.idempleado AND vl.idestacion_servicio = ? AND vl.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.obtenerEmpleadosXRegistroXintervalo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.* FROM venta_litros vl, empleado emp WHERE vl.idempleado = emp.idempleado AND vl.idestacion_servicio = ? AND vl.fecha BETWEEN ? AND ? GROUP BY emp.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findVentasLXestacion = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT vl.idventa_litros, vl.fecha, vl.idempleado, vl.idestacion_servicio, SUM(vl.cantidad) cantidad, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CASE WHEN SUM(vl.descalificado) > 0 THEN true ELSE false END AS descalificado FROM venta_litros vl, empleado emp, estacion_servicio es WHERE emp.idempleado = vl.idempleado AND es.idestacion_servicio = vl.idestacion_servicio AND vl.idempleado = ? AND vl.idestacion_servicio = ? AND vl.fecha = ? GROUP BY vl.fecha, vl.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findVentasL = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT vl.idventa_litros, vl.fecha, vl.idempleado, vl.idestacion_servicio, SUM(vl.cantidad) cantidad, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM venta_litros vl, empleado emp, estacion_servicio es WHERE emp.idempleado = vl.idempleado AND vl.idempleado = ? AND vl.idestacion_servicio = es.idestacion_servicio AND vl.fecha = ? GROUP BY vl.fecha, vl.idempleado`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insertVentaLitros = (data) =>
  new Promise((resolve, reject) => {
    let sql = `INSERT INTO venta_litros SET ?`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
