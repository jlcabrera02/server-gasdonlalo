import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, peticionImposible } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM empleado";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findSolicitud = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM empleado WHERE idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1)
        return reject(sinRegistro("No existe la solicitud de empleo"));
      if (res) return resolve(res[0]);
    });
  });

model.findXEstatus = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM empleado WHERE estatus = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXTrabajando = () =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM empleado WHERE estatus = 1 OR estatus = 2 ORDER BY idchecador";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO empleado SET `fecha_registro` = CURRENT_TIMESTAMP, ?";

    connection.query(sql, data, (err, res) => {
      if (err) {
        if (err.errno === 1062)
          return reject(peticionImposible("Ya esta asignado el id"));
        return reject(errorDB());
      }
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE empleado SET `update_time` = CURRENT_TIMESTAMP, ? WHERE idempleado = ?";

    connection.query(sql, data, (err, res) => {
      console.log(data);
      if (err) {
        if (err.errno === 1062)
          return reject(peticionImposible("El id ya esta asignado"));
        return reject(errorDB());
      }
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
