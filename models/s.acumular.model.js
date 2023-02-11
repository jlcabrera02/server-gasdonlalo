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
        "SELECT snc.*, inc.incumplimiento FROM sncacumuladas snc, empleado emp, incumplimiento inc WHERE snc.idempleado = emp.idempleado AND snc.idincumplimiento = inc.idincumplimiento AND snc.capturado = 0 AND emp.iddepartamento = 1 ORDER BY snc.fecha",
        idDepartamento
      );
    } else {
      sql = mysql.format(
        "SELECT snc.*, inc.incumplimiento FROM sncacumuladas snc, empleado emp, incumplimiento inc WHERE snc.idempleado = emp.idempleado AND snc.idincumplimiento = inc.idincumplimiento AND snc.capturado = 0 ORDER BY snc.fecha"
      );
    }

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO sncacumuladas (idincumplimiento, capturado, idempleado, fecha) VALUES (?, 0, ?, ?)";

    connection.query(sql, data, (err, res) => {
      console.log(err, data);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.capturarSNC = (data) =>
  new Promise((resolve, reject) => {
    // capturado = ?
    //Para liberar pendientes
    let sql = "UPDATE sncacumuladas SET ? WHERE idsncacumuladas = ?";

    connection.query(sql, data, (err, res) => {
      console.log(data);
      if (err) {
        return reject(errorDB());
      }
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM sncacumuladas WHERE idsncacumuladas = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
