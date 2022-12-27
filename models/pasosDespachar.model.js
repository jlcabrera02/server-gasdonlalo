import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

//Obtiene todas las evaluaciones del empleado por el periodo de tiempo que le asignemos
model.findCantidadEvaluacionesXempleado = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT emp.idempleado,
CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo,
emp.estatus, evd.create_time, evd.fecha FROM evaluacion_despachar evd, empleado emp WHERE evd.idempleado = emp.idempleado AND 
emp.idempleado = ? AND evd.fecha BETWEEN ? AND ? GROUP BY evd.create_time, evd.fecha`;

    let quincena = data.quincena;

    if (quincena > 1) {
      sql = mysql.format(sql, [
        data.id,
        mysql.raw(`DATE_ADD('${data.fecha}', INTERVAL 15 DAY)`),
        mysql.raw(`LAST_DAY('${data.fecha}')`),
      ]);
    } else {
      sql = mysql.format(sql, [
        data.id,
        data.fecha,
        mysql.raw(`DATE_ADD('${data.fecha}', INTERVAL 14 DAY)`),
      ]);
    }

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEvaluacionXempleado = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT evd.idevaluacion_despachar, evd.fecha, evd.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, evd.evaluacion, pd.idpaso_despachar, pd.paso 
FROM evaluacion_despachar evd, paso_despachar pd, empleado emp
WHERE pd.idpaso_despachar = evd.idpaso_despachar AND emp.idempleado = evd.idempleado AND emp.idempleado = ? AND evd.create_time = ? ORDER BY evd.create_time`;

    connection.query(sql, data, (err, res) => {
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

model.verificar = (data) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql =
      "SELECT * from recoleccion_efectivo WHERE fecha = ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(true);
      if (res) return reject(datosExistentes());
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO evaluacion_despachar (fecha, idempleado, idpaso_despachar, evaluacion) VALUES ?";

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
      "UPDATE evaluacion_despachar SET evaluacion = ? WHERE idevaluacion_despachar = ? AND idempleado = ?";

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
