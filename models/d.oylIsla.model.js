import connection from "./connection";
import mysql from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findEvaluacionXmensual = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT oyl.*, oylc.cumplimiento, emp.idempleado, emp.idchecador, emp.estatus, emp.nombre, emp.apellido_paterno,
emp.apellido_materno, es.nombre estacion, incidentes FROM oyl, oyl_cumplimiento oylc, empleado emp, estacion_servicio es 
WHERE oyl.idoyl_cumplimiento = oylc.idoyl_cumplimiento AND
emp.idempleado = oyl.idempleado AND es.idestacion_servicio = oyl.idestacion_servicio AND oyl.fecha BETWEEN ? AND LAST_DAY(?)`;

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

model.findByIdentificador = (identidicador) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT oyl.*, oylc.cumplimiento, emp.idempleado, emp.idchecador, emp.estatus, emp.nombre, emp.apellido_paterno,
    emp.apellido_materno, es.nombre estacion, incidentes FROM oyl, oyl_cumplimiento oylc, empleado emp, estacion_servicio es
    WHERE oyl.idoyl_cumplimiento = oylc.idoyl_cumplimiento AND
    emp.idempleado = oyl.idempleado AND es.idestacion_servicio = oyl.idestacion_servicio AND oyl.identificador = ?`;

    connection.query(sql, identidicador, (err, res) => {
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

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO oyl (fecha, isla, idestacion_servicio, idempleado, idoyl_cumplimiento, identificador, cumple, idturno, incidentes) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      console.log(err);
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
      console.log(res);
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
