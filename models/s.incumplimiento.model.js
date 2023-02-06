import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM incumplimiento";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findByConcurso = (iddepartamento) =>
  //Me sirve para pintar una tabla en la cual aparecera todas las inconformidades por puntos
  new Promise((resolve, reject) => {
    let sql = `SELECT cinc.*, inc.incumplimiento FROM categorizar_incumplimiento cinc, concurso c, incumplimiento inc WHERE cinc.idconcurso = c.idconcurso AND cinc.idincumplimiento = inc.idincumplimiento AND c.concurso = 1 AND c.iddepartamento = ? ORDER BY cantidad`;

    connection.query(sql, iddepartamento, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findIncumplimientosXcategorizacion = (idConcurso, iddepartamento) =>
  new Promise((resolve, reject) => {
    /* let sql = `SELECT * FROM (SELECT i.*, ci.idconcurso FROM incumplimiento i LEFT JOIN categorizar_incumplimiento ci ON i.idincumplimiento = ci.idincumplimiento WHERE ci.idconcurso = ? UNION SELECT i.*, ci.idconcurso FROM incumplimiento i LEFT JOIN categorizar_incumplimiento ci ON i.idincumplimiento = ci.idincumplimiento WHERE ci.idconcurso IS NULL) tableA ORDER BY tableA.idincumplimiento`; */

    let sql;

    if (!iddepartamento) {
      sql = mysql.format(
        `SELECT inc.incumplimiento, inc.idincumplimiento, cinc.idconcurso, cinc.cantidad  FROM (SELECT * FROM concurso c, incumplimiento inc WHERE c.concurso = ? AND iddepartamento = 1) inc LEFT JOIN (SELECT * FROM categorizar_incumplimiento WHERE idconcurso = ?) cinc ON inc.idincumplimiento = cinc.idincumplimiento`,
        [idConcurso, idConcurso]
      );
    } else {
      sql = mysql.format(
        `SELECT inc.incumplimiento, inc.idincumplimiento, cinc.idconcurso, cinc.cantidad  FROM (SELECT * FROM concurso c, incumplimiento inc WHERE c.concurso = 1 AND c.iddepartamento = ?) inc LEFT JOIN (SELECT * FROM categorizar_incumplimiento WHERE idconcurso = 1) cinc ON inc.idincumplimiento = cinc.idincumplimiento`,
        [idConcurso, iddepartamento, idConcurso]
      );
    }

    connection.query(sql, idConcurso, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO incumplimiento SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.categorizarSNC = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO categorizar_incumplimiento (idconcurso, idincumplimiento) VALUES (?, ?)";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.descategorizarSNC = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM categorizar_incumplimiento WHERE idconcurso = ? AND idincumplimiento = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateCantidadInc = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE categorizar_incumplimiento SET cantidad = ? WHERE idconcurso = ? AND idincumplimiento = ?";

    connection.query(sql, data, (err, res) => {
      console.log(err, res, data);
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE incumplimiento SET ? WHERE idincumplimiento = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM incumplimiento WHERE idincumplimiento = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
