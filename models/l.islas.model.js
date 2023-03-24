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
      "INSERT INTO isla VALUES (nIsla, direccion, idestacion_servicio) VALUES (?, 'I', ?), (?, 'D', ?)";

    connection.query(
      sql,
      [nisla, idEstacion, nisla, idEstacion],
      (err, res) => {
        // console.log(res);
        // console.log([idIsla, idGas]);
        if (err) return reject(errorDB());
        if (res.length < 1) return reject(sinRegistro());
        if (res) return resolve(res[0]);
      }
    );
  });

model.insertHasEstacionYTipos = (nisla, idEstacion) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO isla VALUES (nIsla, direccion, idestacion_servicio) VALUES (?, 'I', ?), (?, 'D', ?)";

    connection.query(
      sql,
      [nisla, idEstacion, nisla, idEstacion],
      (err, res) => {
        // console.log(res);
        // console.log([idIsla, idGas]);
        if (err) return reject(errorDB());
        if (res.length < 1) return reject(sinRegistro());
        if (res) return resolve(res[0]);
      }
    );
  });

export default model;
