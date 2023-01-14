import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

const model = {};

model.findRecursos = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT re.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM recurso_entrega re, empleado emp WHERE re.idempleado_recibe = emp.idempleado ORDER BY re.fecha`;
    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findRecursosXId = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT re.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM recurso_entrega re, empleado emp WHERE re.idempleado_recibe = emp.idempleado AND re.idrecurso_entrega = ? ORDER BY re.fecha`;
    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = `INSERT INTO recurso_entrega SET ?`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
