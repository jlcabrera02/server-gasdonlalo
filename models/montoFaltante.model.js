import connection from "./connection";

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql =
      'SELECT CONCAT(em.nombre, " ", em.apellido_paterno, " ", em.apellido_materno) as nombre_completo, mf.* FROM monto_faltante as mf, empleado as em WHERE mf.empleado = em.idempleado';

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
    let sql = "INSERT INTO monto_faltante SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE monto_faltante SET ? WHERE idmonto_faltante = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM monto_faltante WHERE idmonto_faltante = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(err);
      if (res) return resolve(res);
    });
  });

export default model;
