import connection from "./connection";
import mysql from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

const tiempoLocal = (date) =>
  new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000);

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
	CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", apellido_materno) AS nombre_completo,
  emp.idempleado,
	ev_un.fecha,
	ev_un.total,
	pm.puntaje AS puntaje_minimo,
  CASE
    WHEN DAY(ev_un.fecha) < 15 THEN "Primera Evaluación"
    WHEN DAY(ev_un.fecha) > 14 THEN "Segunda Evaluación"
  END as evaluacion
FROM 
	(SELECT *, sum(cumple) AS total FROM evaluacion_uniforme GROUP BY fecha, idempleado) as ev_un,
    empleado AS emp,
    puntaje_minimo AS pm 
WHERE ev_un.idempleado = emp.idempleado AND ev_un.idpuntaje_minimo = pm.idpuntaje_minimo
ORDER BY ev_un.fecha`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findPasosEvUniforme = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM cumplimiento_uniforme`;

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findPeriodoMensual = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
	emp.idempleado,
	CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", apellido_materno) AS nombre_completo,
	ev_un.fecha,
	ev_un.total,
	pm.puntaje AS puntaje_minimo,
    CASE
WHEN DAY(fecha) < 15 THEN "Primera Evaluación"
WHEN DAY(fecha) > 14 THEN "Segunda Evaluación"
END as evaluacion
FROM 
	(SELECT *, sum(cumple) AS total FROM evaluacion_uniforme GROUP BY fecha, idempleado) as ev_un,
    empleado AS emp,
    puntaje_minimo AS pm 
WHERE 
  ev_un.idempleado = emp.idempleado AND ev_un.idpuntaje_minimo = pm.idpuntaje_minimo AND
  fecha BETWEEN ? AND LAST_DAY(?)
ORDER BY fecha`;

    connection.query(sql, [fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findPeriodoMensualEmpleado = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
	emp.idempleado,
	CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", apellido_materno) AS nombre_completo,
	ev_un.fecha,
	ev_un.total,
	pm.puntaje AS puntaje_minimo,
    CASE
WHEN DAY(fecha) < 15 THEN "Primera Evaluación"
WHEN DAY(fecha) > 14 THEN "Segunda Evaluación"
END as evaluacion
FROM 
	(SELECT *, sum(cumple) AS total FROM evaluacion_uniforme GROUP BY fecha, idempleado) as ev_un,
    empleado AS emp,
    puntaje_minimo AS pm 
WHERE 
  ev_un.idempleado = emp.idempleado AND ev_un.idpuntaje_minimo = pm.idpuntaje_minimo AND
  ev_un.idempleado = ? AND
  fecha BETWEEN ? AND LAST_DAY(?)
ORDER BY fecha`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findPeriodoMensualEmpleadosXquincena = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM (SELECT ev.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno, cu.cumplimiento, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM  evaluacion_uniforme ev, empleado emp, cumplimiento_uniforme cu WHERE ev.idempleado = emp.idempleado AND cu.idcumplimiento_uniforme = ev.idcumplimiento_uniforme AND fecha BETWEEN ? AND LAST_DAY(?) AND emp.date_baja IS NULL OR emp.date_baja > ?) AS evaluaciones WHERE idempleado = ? AND quincena = ? ORDER BY idcumplimiento_uniforme`;

    connection.query(
      sql,
      [data[0], data[0], data[0], data[1], data[2]],
      (err, res) => {
        if (err) return reject(errorDB());
        if (res) return resolve(res);
      }
    );
  });

//De aqui busco un empleado con sus puntos con su identificador
model.findOne = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT eu.*, cu.cumplimiento FROM evaluacion_uniforme eu, cumplimiento_uniforme cu WHERE eu.idcumplimiento_uniforme = cu.idcumplimiento_uniforme AND eu.identificador = ? ORDER BY cu.idcumplimiento_uniforme`;

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.validarNoDuplicadoXQuincena = (data) =>
  new Promise((resolve, reject) => {
    let quinceFechaMes = `${tiempoLocal(data.fecha).getFullYear()}-${
      tiempoLocal(data.fecha).getMonth() + 1
    }`;
    let sql;
    if (tiempoLocal(data.fecha).getUTCDate() > 15) {
      quinceFechaMes += "-16";
      sql = mysql.format(
        "SELECT * FROM evaluacion_uniforme WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?)  GROUP BY fecha, idempleado",
        [data.empleado, quinceFechaMes, data.fecha]
      );
    } else {
      quinceFechaMes += "-15";
      let primerFechaMes = `${tiempoLocal(data.fecha).getFullYear()}-${
        tiempoLocal(data.fecha).getMonth() + 1
      }-01`;

      sql = mysql.format(
        `SELECT * FROM evaluacion_uniforme WHERE idempleado = ? AND fecha BETWEEN '${primerFechaMes}' AND '${quinceFechaMes}'  GROUP BY fecha, idempleado`,
        [data.empleado]
      );
    }

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false);
      if (res)
        return reject(
          datosExistentes(
            "Ya hay un registro para el usuario en el intervalo de tiempo correspondiente"
          )
        );
    });
  });

model.findXTiempo = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT eu.*, SUM(eu.cumple) total_evaluacion, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) nombre_completo, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM evaluacion_uniforme eu, empleado emp WHERE emp.idempleado = eu.idempleado AND emp.idempleado = ? GROUP BY eu.identificador ORDER BY eu.fecha ASC`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO evaluacion_uniforme (fecha, idempleado, idcumplimiento_uniforme, idpuntaje_minimo, cumple, identificador) VALUES ?";

    connection.query(sql, [data], (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql = "";

    data.forEach((query) => {
      sql += mysql.format(
        "UPDATE evaluacion_uniforme SET cumple = ? WHERE idevaluacion_uniforme = ? AND idempleado = ?;  ",
        query
      );
    });

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM evaluacion_uniforme WHERE identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
