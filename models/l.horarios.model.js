import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.obtenerHorario = (fechas) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM horarios, empleado emp, estacion_servicio es WHERE horarios.idempleado = emp.idempleado AND horarios.idestacion_servicio = es.idestacion_servicio AND  fechaturno BETWEEN ? AND ?";

    connection.query(sql, fechas, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.obtenerHorarioById = (idHorario) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM horarios WHERE  idhorario = ?";

    connection.query(sql, idHorario, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.insertarHorarios = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO horarios (idempleado, idturno, fechaTurno, fechaLiquidacion, idestacion_servicio) VALUE (?,?,?,?,?)";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.updateHorario = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE horarios SET ? WHERE idhorario = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.eliminarHorario = (idHorario) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM  horarios WHERE idhorario = ?";

    connection.query(sql, idHorario, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

/* 

model.updateMangueras = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((el) => {
      sql += format(
        "UPDATE mangueras SET tiene = ? WHERE idgas = ? AND idisla = ? AND direccion = ?; ",
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
  }); */

export default model;
