import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findOrdenTrabajoCalidadXEstacion = (id, fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT otc.idotrabajo_mantenimiento, otc.tipo_mantenimiento, otc.fecha_inicio, otc.fecha_termino,otc.descripcion_falla, otc.idarea, area.area, otc.idempleado_solicita, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS empleado_solicita, ets.nombre AS estacion_servicio FROM otrabajo_mantenimiento otc, empleado emp, estacion_servicio ets, area WHERE area.idarea = otc.idarea AND emp.idempleado = otc.idempleado_solicita AND ets.idestacion_servicio = otc.idestacion_servicio AND ets.idestacion_servicio = ? AND otc.fecha_inicio BETWEEN ? AND LAST_DAY(?)`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findTotalOTXMesXEstacion = (id, fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ets.nombre AS estacion_servicio, m.idmantenimiento, m.mantenimiento, COUNT(m.mantenimiento) AS cantidad FROM otrabajo_mantenimiento otc, estacion_servicio ets, area, mantenimiento m WHERE area.idarea = otc.idarea AND ets.idestacion_servicio = otc.idestacion_servicio AND m.idmantenimiento = area.idmantenimiento AND ets.idestacion_servicio = ? AND otc.fecha_inicio BETWEEN ? AND LAST_DAY(?) GROUP BY m.idmantenimiento  ORDER BY m.idmantenimiento`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findTotaOTXMantenimiento = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ets.nombre AS estacion_servicio, m.mantenimiento, area.area, COUNT(area.area) AS cantidad FROM otrabajo_mantenimiento otc, estacion_servicio ets, area, mantenimiento m WHERE area.idarea = otc.idarea AND ets.idestacion_servicio = otc.idestacion_servicio AND m.idmantenimiento = area.idmantenimiento AND ets.idestacion_servicio = ? AND area.idmantenimiento = ? AND otc.fecha_inicio BETWEEN ? AND LAST_DAY(?) GROUP BY area.idarea  ORDER BY area.idarea`;
    // [idEstacionServicio, idMantenimiento, fecha, fecha];
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO otrabajo_mantenimiento SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.findTotaOTXDetalladaXArea = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ets.nombre AS estacion_servicio, m.mantenimiento, area.area, otc.tipo_mantenimiento, otc.descripcion_falla, otc.fecha_inicio, otc.fecha_termino, area.idarea, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_empleado_solicita FROM otrabajo_mantenimiento otc, estacion_servicio ets, area, mantenimiento m, empleado emp WHERE area.idarea = otc.idarea AND ets.idestacion_servicio = otc.idestacion_servicio AND m.idmantenimiento = area.idmantenimiento AND emp.idempleado = otc.idempleado_solicita AND ets.idestacion_servicio = ? AND area.idarea = ? AND otc.fecha_inicio BETWEEN ? AND LAST_DAY(?) ORDER BY otc.fecha_inicio`;
    // [idEstacionServicio, idMantenimiento, fecha, fecha];
    connection.query(sql, [...data, data[2]], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO otrabajo_mantenimiento SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE otrabajo_mantenimiento SET ? WHERE idotrabajo_mantenimiento = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM otrabajo_mantenimiento WHERE idotrabajo_mantenimiento = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
