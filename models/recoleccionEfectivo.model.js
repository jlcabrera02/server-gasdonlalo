import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

model.findAllXMonth = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
    *
FROM
    (SELECT 
        emp.idempleado,
        CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo,
        emp.iddepartamento,
        emp.estatus,
        rc.idrecoleccion_efectivo, rc.fecha, rc.cantidad
    FROM
        (SELECT 
        *
    FROM
        empleado
    WHERE
        estatus = 1 AND iddepartamento = 1) AS emp
    LEFT OUTER JOIN (SELECT 
        *
    FROM
        recoleccion_efectivo
    WHERE
        fecha = ?) AS rc ON emp.idempleado = rc.idempleado) AS TABLEA`;

    connection.query(sql, fecha, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findAllRegistersXMonth = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
        emp.idempleado,
        CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo,
        emp.iddepartamento,
        emp.estatus,
        SUM(rc.cantidad) AS cantidad_mes
    FROM
        (SELECT 
        *
    FROM
        empleado
    WHERE
        estatus = 1 AND iddepartamento = 1) AS emp, (SELECT 
        *
    FROM
        recoleccion_efectivo WHERE fecha BETWEEN ? AND LAST_DAY(?)) AS rc WHERE emp.idempleado = rc.idempleado GROUP BY idempleado`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });
model.findAllRegistersXMonth = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
        emp.idempleado,
        CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo,
        emp.iddepartamento,
        emp.estatus,
        SUM(rc.cantidad) AS cantidad_mes
    FROM
        (SELECT 
        *
    FROM
        empleado
    WHERE
        estatus = 1 AND iddepartamento = 1) AS emp, (SELECT 
        *
    FROM
        recoleccion_efectivo WHERE fecha BETWEEN ? AND LAST_DAY(?)) AS rc WHERE emp.idempleado = rc.idempleado GROUP BY idempleado`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findAllRegistersXMonthXEmpleado = (fecha, id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
    emp.*, rc.idrecoleccion_efectivo, rc.fecha, rc.cantidad
FROM
    empleado AS emp,
    recoleccion_efectivo AS rc
WHERE
    emp.idempleado = rc.idempleado
        AND emp.idempleado = ?
        AND fecha BETWEEN ? AND LAST_DAY(?)`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql =
      "SELECT * FROM recoleccion_efectivo WHERE idrecoleccion_efectivo = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.verificar = (data) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql =
      "SELECT * from recoleccion_efectivo WHERE fecha = ? AND idempleado = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(true);
      if (res) return reject(datosExistentes());
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO recoleccion_efectivo SET ?";

    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE recoleccion_efectivo SET cantidad = ? WHERE idrecoleccion_efectivo = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM recoleccion_efectivo WHERE idrecoleccion_efectivo = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
