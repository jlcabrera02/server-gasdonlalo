import connection from "./connection";
import mysql from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findEvaluacionXmensual = (data, quincena) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT oyl.*, oylc.cumplimiento, emp.idempleado, emp.idchecador, emp.estatus, emp.nombre, emp.apellido_paterno,
emp.apellido_materno, es.nombre estacion, incidentes FROM oyl, oyl_cumplimiento oylc, empleado emp, estacion_servicio es 
WHERE oyl.idoyl_cumplimiento = oylc.idoyl_cumplimiento AND
emp.idempleado = oyl.idempleado AND es.idestacion_servicio = oyl.idestacion_servicio AND oyl.fecha BETWEEN ? AND ${
      quincena === "1" ? "?" : "LAST_DAY(?)"
    }`;

    if (data.length > 2) {
      sql +=
        " AND emp.idempleado = ? ORDER BY oyl.fecha, oylc.idoyl_cumplimiento";
    }

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findByIdentificador = (identificador) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT oyl.*, oylc.cumplimiento, emp.idempleado, emp.idchecador, emp.estatus, emp.nombre, emp.apellido_paterno,
    emp.apellido_materno, es.nombre estacion, incidentes FROM oyl, oyl_cumplimiento oylc, empleado emp, estacion_servicio es
    WHERE oyl.idoyl_cumplimiento = oylc.idoyl_cumplimiento AND
    emp.idempleado = oyl.idempleado AND es.idestacion_servicio = oyl.idestacion_servicio AND oyl.identificador = ?`;

    connection.query(sql, identificador, (err, res) => {
      if (err) return reject(errorDB());
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findCumplimientos = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM oyl_cumplimiento`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findHistorial = (idEmpleado) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT o.*, es.nombre estacionServicio, t.turno, SUM(o.cumple) total, emp.* FROM oyl o, oyl_cumplimiento oc, estacion_servicio es, turno t, empleado emp WHERE oc.idoyl_cumplimiento = o.idoyl_cumplimiento AND o.idestacion_servicio = es.idestacion_servicio AND o.idturno = t.idturno AND emp.idempleado = o.idempleado AND o.idempleado = ? GROUP BY identificador ORDER BY fecha DESC`;

    connection.query(sql, idEmpleado, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXMesXEmpleadoEv = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT SUM(cumple) total, COUNT(*) todo FROM oyl WHERE fecha BETWEEN ? AND ? AND idempleado = ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM oyl WHERE idoyl = ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO oyl (fecha, isla, idestacion_servicio, idempleado, idoyl_cumplimiento, identificador, cumple, idturno, incidentes) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((query) => {
      sql += mysql.format(
        "UPDATE oyl SET cumple = ? WHERE idoyl = ? AND idempleado = ?;  ",
        query
      );
    });

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM oyl WHERE identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
