import connection from "./connection";
import mysql from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findPasosEvUniforme = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM cumplimiento_uniforme`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEvaluacionMensual = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ev.*, cu.cumplimiento, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM evaluacion_uniforme ev, cumplimiento_uniforme cu, empleado emp WHERE ev.idcumplimiento_uniforme = cu.idcumplimiento_uniforme AND emp.idempleado = ev.idempleado AND ev.fecha BETWEEN ? AND LAST_DAY(?)`;

    if (data.length > 2) {
      sql += ` AND ev.idempleado = ? ORDER BY ev.fecha`;
    }

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      // if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

//De aqui busco un empleado con sus puntos con su identificador
model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT eu.*, cu.cumplimiento FROM evaluacion_uniforme eu, cumplimiento_uniforme cu WHERE eu.idcumplimiento_uniforme = cu.idcumplimiento_uniforme AND eu.identificador = ? ORDER BY cu.idcumplimiento_uniforme`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

//Me obtienen solo el elemento no agrupado.
model.findByOne = (idEvUni) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM evaluacion_uniforme WHERE idevaluacion_uniforme = ?`;

    connection.query(sql, idEvUni, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.findXTiempo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT eu.*, SUM(eu.cumple) total_evaluacion, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) nombre_completo, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM evaluacion_uniforme eu, empleado emp WHERE emp.idempleado = eu.idempleado AND emp.idempleado = ? GROUP BY eu.identificador ORDER BY eu.fecha ASC`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO evaluacion_uniforme (fecha, idempleado, idcumplimiento_uniforme, idpuntaje_minimo, cumple, identificador) VALUES ?";

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
        "UPDATE evaluacion_uniforme SET cumple = ? WHERE idevaluacion_uniforme = ? AND idempleado = ?;  ",
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
    let sql = "DELETE FROM evaluacion_uniforme WHERE identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
