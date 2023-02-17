import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT idchecklist_bomba, idempleado, fecha, CASE WHEN isla_limpia = COUNT(isla_limpia) AND aceites_completos = COUNT(aceites_completos) AND turno = COUNT(turno) AND bomba = COUNT(bomba) AND estacion_servicio = COUNT(estacion_servicio) THEN TRUE ELSE FALSE END cumple FROM checklist_bomba WHERE idempleado = ? AND fecha = ? GROUP BY idempleado, fecha`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findOne = (idCk) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, CASE WHEN isla_limpia = 1 AND aceites_completos = 1 AND turno = 1 AND bomba = 1 AND estacion_servicio = 1 THEN TRUE ELSE FALSE END cumple FROM checklist_bomba WHERE idchecklist_bomba = ?`;

    connection.query(sql, idCk, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.findChecklistXmes = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM checklist_bomba WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?) ORDER BY fecha`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO checklist_bomba SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE checklist_bomba SET ? WHERE idchecklist_bomba = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM checklist_bomba WHERE idchecklist_bomba = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
