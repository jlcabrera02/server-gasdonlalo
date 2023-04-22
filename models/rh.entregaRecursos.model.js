import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import { format } from "mysql2";
const { errorDB, sinRegistro } = resErr;

const model = {};

model.findRecursos = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT re.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM recurso_entrega re, empleado emp WHERE re.idempleado_recibe = emp.idempleado ORDER BY re.fecha DESC`;
    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findRecursosByEmpleado = (idEmpleado, fechaI, fechaF) =>
  new Promise((resolve, reject) => {
    let sql;
    if (!fechaF && !fechaI) {
      sql = format(
        `SELECT re.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM recurso_entrega re, empleado emp WHERE re.idempleado_recibe = emp.idempleado AND idempleado = ? ORDER BY re.fecha DESC`,
        idEmpleado
      );
    } else {
      sql = format(
        `SELECT re.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno FROM recurso_entrega re, empleado emp WHERE re.idempleado_recibe = emp.idempleado AND emp.idempleado = ? AND re.fecha BETWEEN ? AND ? ORDER BY re.fecha DESC`,
        [idEmpleado, fechaI, fechaF]
      );
    }
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
    let sql = `INSERT INTO recurso_entrega (fecha, cantidad, recurso, idempleado_recibe, tipo_recibo, estado) VALUES ?`;
    connection.query(sql, [data], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.update = (data, id) =>
  new Promise((resolve, reject) => {
    let sql = `UPDATE recurso_entrega SET ? WHERE idrecurso_entrega = ?`;
    connection.query(sql, [data, id], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.delete = (data) =>
  new Promise((resolve, reject) => {
    let sql = `DELETE FROM recurso_entrega WHERE idrecurso_entrega = ? `;
    connection.query(sql, [data], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

export default model;
