import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = (query = null) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND estatus = 1 ORDER BY empleado.nombre";
    if (query)
      sql = `SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND estatus = 1 AND departamento.iddepartamento = ${query} ORDER BY empleado.nombre`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.validarDepartamento = (id) =>
  new Promise((resolve, reject) => {
    let sql = "SELECT iddepartamento FROM empleado WHERE idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0].iddepartamento);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO empleados SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE empleado SET ? WHERE idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE empleado SET estatus = 0 WHERE idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
