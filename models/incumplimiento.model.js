import connection from "./connection";

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT incumplimiento.*, departamento.departamento FROM departamento, incumplimiento WHERE incumplimiento.departamento = departamento.iddepartamento";

    connection.query(sql, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT incumplimiento.*, departamento.departamento FROM departamento, incumplimiento WHERE incumplimiento.departamento = departamento.iddepartamento AND idincumplimiento = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO incumplimiento SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE incumplimiento SET ? WHERE idincumplimiento = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM incumplimiento WHERE idincumplimiento = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

export default model;
