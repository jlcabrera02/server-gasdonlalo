import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM estacion_servicio";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findTurnos = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM turno_estacion te, estacion_servicio es, turno t WHERE te.idestacion_servicio = es.idestacion_servicio AND te.idturno = t.idturno AND es.idestacion_servicio = 1 ORDER BY t.idturno`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1)
        return reject(
          sinRegistro("No se encontraron turno para esta estación")
        );
      if (res) return resolve(res);
    });
  });

model.findAllTurnos = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM turno`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO estacion_servicio SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE estacion_servicio SET ? WHERE idestacion_servicio = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM estacion_servicio WHERE idestacion_servicio = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
