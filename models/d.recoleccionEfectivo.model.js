import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

model.findEmpleadosXMonth = (fecha) =>
  //Extrae todo los empleados que han obtenido recoleccion en el mes
  new Promise((resolve, reject) => {
    let sql = `SELECT rc.idempleado, SUM(rc.cantidad) AS total_cantidad_mes, COUNT(rc.idempleado) AS total_de_recolecciones, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CONCAT(nombre, " ", emp.apellido_paterno," ", emp.apellido_materno) AS nombre_completo FROM recoleccion_efectivo rc, empleado emp WHERE emp.idempleado = rc.idempleado AND rc.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado ORDER BY emp.nombre`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findEmpleadosXFecha = (data) =>
  //Extrae todo un empleado por una fecha especifica
  new Promise((resolve, reject) => {
    let sql = `SELECT rc.idrecoleccion_efectivo, rc.fecha, SUM(rc.cantidad) AS total_cantidad FROM recoleccion_efectivo rc, empleado emp WHERE emp.idempleado = rc.idempleado AND rc.fecha = ? AND rc.idempleado = ? GROUP BY rc.idempleado`;
    //[fecha, idempleado]
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
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

model.findXTiempo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT re.*, emp.idempleado, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.iddepartamento,emp.nombre, emp.apellido_paterno, emp.apellido_materno, emp.estatus FROM recoleccion_efectivo AS re, empleado AS emp WHERE re.idempleado = emp.idempleado AND re.fecha = ? AND emp.idempleado = ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO recoleccion_efectivo SET ?";

    connection.query(sql, data, (err, res) => {
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
