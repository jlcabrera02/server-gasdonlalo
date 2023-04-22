import connection from "./connection";
import { format } from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.findIslas = (idEstacion) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM islas WHERE idestacion_servicio = ?";

    connection.query(sql, idEstacion, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findManguerasByIsla = (idIsla) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM mangueras WHERE idisla = ?";

    connection.query(sql, idIsla, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insertIsla = (nisla, idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO islas (nIsla, idestacion_servicio, habilitada) VALUES (?, ?, 1)";

    connection.query(
      sql,
      [nisla, idEstacion, nisla, idEstacion],
      (err, res) => {
        if (err) return reject(errorDB());
        if (res.affectedRows < 1) return reject(sinCambios());
        if (res) return resolve(res);
      }
    );
  });

model.insertManguera = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO mangueras (idisla, idgas, tiene, direccion, idmanguera) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      console.log(err, "m");

      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateMangueras = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((el) => {
      sql += format(
        "UPDATE mangueras SET tiene = ? WHERE idmanguera = ?; ",
        el
      );
    });

    connection.query(sql, (err, res) => {
      console.log(err, data);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateIsla = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE islas SET  ? WHERE idisla = ?";

    connection.query(sql, data, (err, res) => {
      console.log(data);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
