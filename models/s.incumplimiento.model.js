import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
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

model.findIncumplimientosXcategorizacion = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM (SELECT i.*, ci.idconcurso FROM incumplimiento i LEFT JOIN categorizar_incumplimiento ci ON i.idincumplimiento = ci.idincumplimiento WHERE ci.idconcurso = ? UNION SELECT i.*, ci.idconcurso FROM incumplimiento i LEFT JOIN categorizar_incumplimiento ci ON i.idincumplimiento = ci.idincumplimiento WHERE ci.idconcurso IS NULL) tableA ORDER BY tableA.idincumplimiento`;

    connection.query(sql, id, (err, res) => {
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
