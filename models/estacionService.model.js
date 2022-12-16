import connection from "./connection";

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM estacion_servicio";

    connection.query(sql, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM monto_faltante";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO estacion_servicio SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE estacion_servicio SET ? WHERE idestacion_servicio = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM estacion_servicio WHERE idestacion_servicio = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

export default model;
