import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findTotalSalidasXDiaXEmpleado = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total_salidas FROM salida_noconforme WHERE idempleado = ? AND fecha = ? AND idincumplimiento IN (SELECT idincumplimiento FROM categorizar_incumplimiento WHERE idconcurso = ?)`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.findSalidasNoConformesXMes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT sn.*, inc.incumplimiento, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idincumplimiento = inc.idincumplimiento AND emp.idempleado = sn.idempleado AND sn.fecha BETWEEN ? AND LAST_DAY(?) ORDER BY sn.fecha, create_time DESC`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSalidasNoConformesXMesXIddepartamento = (fecha, id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT sn.*, inc.incumplimiento, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idincumplimiento = inc.idincumplimiento AND emp.idempleado = sn.idempleado AND emp.iddepartamento = ? AND sn.fecha BETWEEN ? AND LAST_DAY(?) ORDER BY sn.fecha DESC`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT sn.idsalida_noconforme, sn.fecha, sn.descripcion_falla, sn.acciones_corregir, sn.concesiones, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo_incumple, emp.iddepartamento AS iddepartamento_incumple, sn.idempleado AS idempleado_incumple, inc.idincumplimiento, emp.idchecador AS idchecador_empleado_incumple FROM salida_noconforme sn, empleado emp, incumplimiento inc WHERE sn.idempleado = emp.idempleado AND sn.idincumplimiento = inc.idincumplimiento AND sn.idsalida_noconforme = ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findByEmpleado = (idEmpleado) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT snc.*, inc.incumplimiento FROM salida_noconforme snc, incumplimiento inc WHERE inc.idincumplimiento = snc.idincumplimiento AND idempleado = ?`;

    connection.query(sql, idEmpleado, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findByEmpleadoXfecha = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT snc.*, inc.incumplimiento FROM salida_noconforme snc, incumplimiento inc WHERE inc.idincumplimiento = snc.idincumplimiento AND idempleado = ? AND snc.fecha BETWEEN ? AND ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      console.log(data);
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSalidasXSemanaXidEmpleado = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) nombre_completo FROM salida_noconforme sn,empleado emp WHERE sn.idempleado = emp.idempleado AND sn.idempleado = ? AND sn.fecha BETWEEN ? AND ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findSNCXIncumplimiento = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT inc.idincumplimiento, inc.incumplimiento, COUNT(SNC.idsalida_noconforme) total FROM incumplimiento inc LEFT JOIN (SELECT * FROM salida_noconforme WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?)) SNC ON SNC.idincumplimiento = inc.idincumplimiento GROUP BY inc.idincumplimiento ORDER BY inc.incumplimiento`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findSNCPendiente = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT snc.*, emp.nombre nombrea, emp.apellido_paterno apellidopa, emp.apellido_materno apellidoma, emp.idchecador AS idchecadora FROM (SELECT sn.*, emp.nombre, inc.incumplimiento, emp.apellido_paterno, emp.apellido_materno, emp.idchecador FROM salida_noconforme sn, incumplimiento inc, empleado emp WHERE inc.idincumplimiento = sn.idincumplimiento AND emp.idempleado = sn.idempleado AND acciones_corregir IS NULL AND concesiones IS NULL AND sn.fecha BETWEEN ? AND LAST_DAY(?)) snc, empleado emp WHERE snc.idempleado_autoriza = emp.idempleado ORDER BY sn.fecha DESC`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSalidasXInconformidadXMesXiddepartemento = (data) =>
  new Promise((resolve, reject) => {
    let sql = data[2]
      ? `SELECT inc.incumplimiento, COUNT(sn.idincumplimiento) AS total FROM salida_noconforme sn, incumplimiento inc, empleado emp WHERE sn.idincumplimiento = inc.idincumplimiento AND emp.idempleado = sn.idempleado AND sn.fecha BETWEEN ? AND LAST_DAY(?) AND emp.iddepartamento = ? GROUP BY sn.idincumplimiento ORDER BY inc.incumplimiento`
      : `SELECT inc.incumplimiento, COUNT(sn.idincumplimiento) AS total FROM salida_noconforme sn, incumplimiento inc, empleado emp WHERE sn.idincumplimiento = inc.idincumplimiento AND emp.idempleado = sn.idempleado AND sn.fecha BETWEEN ? AND LAST_DAY(?)  GROUP BY sn.idincumplimiento ORDER BY inc.incumplimiento`;
    //data = ["2023-12-01", "2023-12-01", 1]
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

//Utilizado para las evaluaciones quincenales
model.findXMesXEmpleadoEv = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT COUNT(*) total FROM salida_noconforme WHERE idincumplimiento NOT IN (?) AND fecha BETWEEN ? AND ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO salida_noconforme SET ?";

    connection.query(sql, data, (err, res) => {
      console.log(err);
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
