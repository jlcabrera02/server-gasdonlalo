import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios } = resErr;

const model = {};

model.find = (query = null) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND estatus IN (1,2) ORDER BY empleado.nombre";
    if (query)
      sql = `SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND estatus IN (1,2) AND departamento.iddepartamento = ${query} ORDER BY empleado.nombre`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (idEmpleado) =>
  //La usare para obtener todo los atributos con el idempleado.
  new Promise((resolve, reject) => {
    let sql =
      "SELECT empleado.*, departamento.departamento FROM empleado, departamento WHERE empleado.iddepartamento = departamento.iddepartamento AND empleado.idempleado = ?";

    connection.query(sql, idEmpleado, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEmpleadosXmesXiddepartamento = (idDepartamento) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo FROM empleado emp WHERE emp.iddepartamento = ? AND emp.estatus IN (1,2) ORDER BY nombre_completo`;

    connection.query(sql, idDepartamento, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEmpleadosXmes = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo FROM empleado emp WHERE emp.estatus IN (1,2) ORDER BY nombre_completo`;

    connection.query(sql, data, (err, res) => {
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
    let sql = "INSERT INTO empleado SET ?";

    connection.query(sql, data, (err, res) => {
      if (err) {
        if (err.errno === 1062) {
          return reject(errorDB("Ya existe un usuario con ese id"));
        }
        return reject(errorDB(err.code));
      }
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data, idEmpleado) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE empleado SET `update_time` = CURRENT_TIMESTAMP, ? WHERE idempleado = ?";

    connection.query(sql, [data, idEmpleado], (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE empleado SET estatus = 3 WHERE idchecador = ?";

    connection.query(sql, id, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
