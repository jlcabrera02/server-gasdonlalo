import connection from "./connection";
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
      "INSERT INTO isla (nIsla, direccion, idestacion_servicio, habilitada) VALUES (?, 'I', ?, 1), (?, 'D', ?, 1)";

    connection.query(
      sql,
      [nisla, idEstacion, nisla, idEstacion],
      (err, res) => {
        console.log(err);
        // console.log([idIsla, idGas]);
        if (err) return reject(errorDB());
        if (res.length < 1) return reject(sinRegistro());
        if (res) return resolve(res[0]);
      }
    );
  });

model.insertGas = (idisla) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO isla VALUES (idisla, idgas, tiene) VALUES (?, 'M', 0), (?, 'P', 0), (?, 'D', 0)";

    connection.query(sql, [idisla, idisla, idisla], (err, res) => {
      // console.log(res);
      // console.log([idIsla, idGas]);
      console.log(gas);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

export default model;
