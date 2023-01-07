import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

model.findEntradasXidEmpleadoXMes = (id, fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ce.*, t.hora_anticipo, t.turno, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM captura_entrada ce, turno t, empleado emp WHERE ce.idturno = t.idturno AND emp.idempleado = ce.idempleado AND ce.idempleado = ? AND ce.fecha BETWEEN ? AND LAST_DAY(?)`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findRetardosXsemanas = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ce.*, t.hora_anticipo, t.turno, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM captura_entrada ce, turno t, empleado emp WHERE ce.idturno = t.idturno AND emp.idempleado = ce.idempleado AND ce.idempleado = ? AND ce.fecha BETWEEN ? AND ? ORDER BY ce.fecha`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.validarDuplicados = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ce.idcaptura_entrada FROM captura_entrada ce WHERE idempleado = ? AND fecha = ? AND idturno = ?`;

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false);
      if (res)
        return reject(
          datosExistentes("Ya se capturo entrada para el empleado")
        );
    });
  });

model.findFalta = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM tipo_falta WHERE idtipo_falta > 1`;

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.horaAnticipo = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT hora_anticipo FROM turno WHERE idturno = ?`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro("No existe este turno"));
      if (res) return resolve(res[0].hora_anticipo);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO captura_entrada SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM captura_entrada WHERE iddocumento = ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });
0;

export default model;
