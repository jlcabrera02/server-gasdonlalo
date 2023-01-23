import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

//Obtiene todas las evaluaciones del empleado por el periodo de tiempo que le asignemos
model.findEvaluacionesXEmpleado = (id, quincena) =>
  new Promise((resolve, reject) => {
    let sql;
    if (quincena) {
      sql = mysql.format(
        `SELECT * FROM (SELECT emp.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.estatus, evd.create_time, evd.fecha, evd.identificador, evd.idpaso_despachar, evd.evaluacion, pd.paso, CASE WHEN DAY(fecha) < 15 THEN 1 WHEN DAY(fecha) > 14 THEN 2 END AS quincena FROM evaluacion_despachar evd, empleado emp, paso_despachar pd WHERE evd.idempleado = emp.idempleado AND pd.idpaso_despachar = evd.idpaso_despachar AND identificador = ? ) evd WHERE evd.quincena = ? ORDER BY evd.idpaso_despachar`,
        [id, quincena]
      );
    } else {
      sql = mysql.format(
        `SELECT emp.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.estatus, evd.create_time, evd.fecha, evd.identificador, evd.idpaso_despachar, evd.evaluacion, pd.paso, CASE WHEN DAY(fecha) < 15 THEN 1 WHEN DAY(fecha) > 14 THEN 2 END AS quincena FROM evaluacion_despachar evd, empleado emp, paso_despachar pd WHERE evd.idempleado = emp.idempleado AND pd.idpaso_despachar = evd.idpaso_despachar AND identificador = ? ORDER BY evd.idpaso_despachar`,
        id
      );
    }

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

//Agrupar por identificador lo necesita el modelo findEvaluacionesXEmpleado
model.agruparEvaluaciones = (data) =>
  new Promise((resolve, reject) => {
    let sql;
    if (data.length > 2) {
      sql = mysql.format(
        `SELECT identificador FROM evaluacion_despachar WHERE idempleado = ? AND fecha BETWEEN ? AND ? GROUP BY identificador ORDER BY fecha`,
        data
      );
    } else {
      sql = mysql.format(
        `SELECT identificador FROM evaluacion_despachar WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?) GROUP BY identificador ORDER BY fecha`,
        [data[0], data[1], data[1]]
      );
    }

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql =
      "SELECT evd.*, pd.paso FROM evaluacion_despachar evd, paso_despachar pd WHERE evd.idpaso_despachar = pd.idpaso_despachar AND evd.identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findPasos = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql = "SELECT * FROM paso_despachar";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO evaluacion_despachar (fecha, idempleado, idpaso_despachar, evaluacion, identificador) VALUES ?";

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
        "UPDATE evaluacion_despachar SET evaluacion = ? WHERE idevaluacion_despachar = ? AND idempleado = ?;  ",
        query
      );
    });

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (data) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM evaluacion_despachar WHERE identificador = ?";
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
