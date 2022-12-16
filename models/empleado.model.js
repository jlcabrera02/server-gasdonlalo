import connection from "./connection";

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.departamento = departamento.iddepartamento AND status = 1";

    connection.query(sql, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.departamento = departamento.iddepartamento AND idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO empleado SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE empleado SET ? WHERE idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE empleado SET status = 0 WHERE idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

export default model;
