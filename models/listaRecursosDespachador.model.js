import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

//Obtiene todas las evaluaciones del empleado por el periodo de tiempo que le asignemos
model.findListRecursosXmes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, sum(evaluacion) AS total, pm.puntaje AS limite_minimo, MONTHNAME(?) AS mes, emp.idempleado FROM recurso_despachador rd, empleado emp, puntaje_minimo pm WHERE emp.idempleado = rd.idempleado AND rd.idrecurso_minimo = pm.idpuntaje_minimo AND rd.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado`;

    connection.query(sql, [fecha, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findListRecursosXmesXidEmpleado = (id, fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT rd.idrecurso_despachador, rd.fecha, emp.idempleado, rd.idrecurso, r.recurso, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, rd.evaluacion FROM recurso_despachador rd, empleado emp, puntaje_minimo pm, recurso r WHERE emp.idempleado = rd.idempleado AND rd.idrecurso_minimo = pm.idpuntaje_minimo AND r.idrecurso = rd.idrecurso AND emp.idempleado = ? AND rd.fecha BETWEEN ? AND LAST_DAY(?)`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findRecursos = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql = "SELECT * FROM recurso";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO recurso_despachador (fecha, idempleado, idrecurso, idrecurso_minimo, evaluacion) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE recurso_despachador SET evaluacion = ? WHERE idrecurso_despachador = ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM evaluacion_despachar WHERE idevaluacion_despachar >= ? AND idevaluacion_despachar < ? AND idempleado = ?";
    console.log(data);
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
