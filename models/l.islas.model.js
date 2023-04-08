import connection from "./connection";
import { format } from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

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

model.findLecturas = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM lecturas WHERE idisla = ? AND idgas = ? ORDER BY fecha DESC";

    let dataDefault = {
      idLectura: null,
      idgas: data[1],
      idisla: data[0],
      lectura: 0,
      fecha: null,
      numReinicio: 0,
    };

    connection.query(sql, data, (err, res) => {
      console.log(res);
      if (err) return reject(errorDB());
      if (res.length < 1)
        return resolve({
          anterior: null,
          actual: dataDefault,
        });
      if (res.length === 1)
        return resolve({
          anterior: dataDefault,
          actual: res[0],
        });
      if (res)
        return resolve({
          anterior: res[1],
          actual: res[0],
        });
    });
  });

model.findGasolinaTipos = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM gas";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEstacionYTipos = (idIsla, idGas) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM islas_has_gas WHERE idisla = ? AND idgas = ?";

    connection.query(sql, [idIsla, idGas], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.insertIsla = (nisla, idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO islas (nIsla, direccion, idestacion_servicio, habilitada) VALUES (?, 'I', ?, 1), (?, 'D', ?, 1)";
    console.log(sql);

    connection.query(
      sql,
      [nisla, idEstacion, nisla, idEstacion],
      (err, res) => {
        console.log(err, res);
        if (err) return reject(errorDB());
        if (res.length < 1) return reject(sinRegistro());
        if (res) return resolve(res);
      }
    );
  });

model.updateIsla = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((el) => {
      sql += format(
        "UPDATE islas_has_gas SET tiene = ? WHERE idgas = ? AND idisla = ?; ",
        el
      );
    });

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateNumIsla = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE islas SET nisla = ? WHERE idisla IN (?, ?)";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.insertGas = (idisla) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO islas_has_gas (idisla, idgas, tiene) VALUES (?, 'M', 0), (?, 'P', 0), (?, 'D', 0)";

    connection.query(sql, [idisla, idisla, idisla], (err, res) => {
      // console.log(res);
      // console.log([idIsla, idGas]);
      console.log(idisla, err);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

export default model;
