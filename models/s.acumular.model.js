import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinCambios } = resErr;
const model = {};

model.find = (idDepartamento) =>
  new Promise((resolve, reject) => {
    let sql;
    if (idDepartamento) {
      sql = mysql.format(
        "SELECT snc.*, inc.incumplimiento, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM sncacumuladas snc, empleado emp, incumplimiento inc WHERE snc.idempleado = emp.idempleado AND snc.idincumplimiento = inc.idincumplimiento AND snc.capturado = 0 AND emp.iddepartamento = 1 ORDER BY snc.fecha DESC, snc.idsncacumuladas DESC",
        idDepartamento
      );
    } else {
      sql = mysql.format(
        "SELECT snc.*, inc.incumplimiento, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM sncacumuladas snc, empleado emp, incumplimiento inc WHERE snc.idempleado = emp.idempleado AND snc.idincumplimiento = inc.idincumplimiento AND snc.capturado = 0 ORDER BY snc.fecha DESC, snc.idsncacumuladas DESC"
      );
    }

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.validar = (data, capturado = 0) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM sncacumuladas WHERE idempleado = ? AND idincumplimiento = ? AND fecha = ? AND capturado = ?`;

    connection.query(sql, [...data, capturado], (err, res) => {
      console.log("validando", data);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let cortarTexto = data[3].substring(0, 47);
    data[3] = cortarTexto += "...";
    let sql =
      "INSERT INTO sncacumuladas (idincumplimiento, capturado, idempleado, fecha, descripcion) VALUES (?, 0, ?, ?, ?)";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    // por si cambian los datos que se actualize tambien el id del incumplimiento y el id del empleadp
    let sql = "UPDATE sncacumuladas SET ? WHERE idsncacumuladas = ?";

    connection.query(sql, data, (err, res) => {
      console.log(err, data);
      if (err) {
        return reject(errorDB());
      }
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.capturarSNC = (data) =>
  new Promise((resolve, reject) => {
    // capturado = ?
    //Para liberar pendientes
    let sql = "UPDATE sncacumuladas SET ? WHERE idsncacumuladas = ?";

    connection.query(sql, data, (err, res) => {
      if (err) {
        return reject(errorDB());
      }
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (idSncacumulada) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM sncacumuladas WHERE idsncacumuladas = ?";

    connection.query(sql, idSncacumulada, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
