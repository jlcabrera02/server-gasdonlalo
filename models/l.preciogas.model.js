import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.ultimosPrecios = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM precios ORDER BY createdAt DESC LIMIT 3";

    connection.query(sql, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.preciosPorFecha = (fecha) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM precios WHERE fecha = ? ORDER BY fecha, createdAt LIMIT 3";

    connection.query(sql, fecha, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.preciosHistoricos = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM precios";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.nuevosPrecios = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO precios (idgas, fecha, idempleado_captura, precio) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updatePrecios = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE precios SET precio =  ?, updatedAt = CURRENT_TIME, idempleado_captura = ? WHERE idprecio = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
