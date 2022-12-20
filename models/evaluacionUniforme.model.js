import connection from "./connection";
import mysql from "mysql2";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

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

model.findPeriodoMensualEmpleados = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
    TABLEB.idempleado,
    TABLEB.nombre,
    TABLEB.apellido_paterno,
    TABLEB.apellido_materno,
    TABLEB.iddepartamento,
    TABLEB.status,
    TABLEB.fecha AS quincena1,
    TABLED.fecha AS quincena2
FROM
    (SELECT 
        em.idempleado,
            em.nombre,
            em.apellido_paterno,
            em.apellido_materno,
            em.iddepartamento,
            em.status,
            ev_un.idevaluacion_uniforme,
            ev_un.fecha,
            ev_un.quincena
    FROM
        (SELECT 
        *
    FROM
        empleado
    WHERE
        status = 1 AND iddepartamento = 1) AS em
    LEFT OUTER JOIN (SELECT 
        *
    FROM
        (SELECT 
        *,
            SUM(cumple) AS total,
            CASE
                WHEN DAY(fecha) < 15 THEN 1
                WHEN DAY(fecha) > 14 THEN 2
            END AS quincena
    FROM
        evaluacion_uniforme
    WHERE
        fecha BETWEEN ? AND LAST_DAY(?)
    GROUP BY fecha , idempleado) AS TABLEA
    WHERE
        quincena = 1) AS ev_un ON em.idempleado = ev_un.idempleado) AS TABLEB,
    (SELECT 
        em.idempleado,
            em.nombre,
            em.apellido_paterno,
            em.apellido_materno,
            em.iddepartamento,
            em.status,
            ev_un.idevaluacion_uniforme,
            ev_un.fecha,
            ev_un.quincena
    FROM
        (SELECT 
        *
    FROM
        empleado
    WHERE
        status = 1 AND iddepartamento = 1) AS em
    LEFT OUTER JOIN (SELECT 
        *
    FROM
        (SELECT 
        *,
            SUM(cumple) AS total,
            CASE
                WHEN DAY(fecha) < 15 THEN 1
                WHEN DAY(fecha) > 14 THEN 2
            END AS quincena
    FROM
        evaluacion_uniforme
    WHERE
        fecha BETWEEN ? AND LAST_DAY(?)
    GROUP BY fecha , idempleado) AS TABLEC
    WHERE
        quincena = 2) AS ev_un ON em.idempleado = ev_un.idempleado) AS TABLED
WHERE
    TABLEB.idempleado = TABLED.idempleado`;

    connection.query(sql, [fecha, fecha, fecha, fecha], (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

//De aqui busco un empleado con sus puntos obtenidos de una sola fecha
model.findOne = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT 
	ev_un.idevaluacion_uniforme,
    ev_un.fecha, emp.idempleado,
	CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", apellido_materno) AS nombre_completo,
    cum_u.cumplimiento, ev_un.cumple,
    CASE
      WHEN DAY(ev_un.fecha) < 15 THEN "Primera Evaluación"
      WHEN DAY(ev_un.fecha) > 14 THEN "Segunda Evaluación"
    END as evaluacion
FROM 
	evaluacion_uniforme AS ev_un,
    empleado AS emp,
    cumplimiento_uniforme AS cum_u
WHERE 
	ev_un.idempleado = emp.idempleado AND
    ev_un.idcumplimiento_uniforme = cum_u.idcumplimiento_uniforme AND
	ev_un.idempleado = ? AND ev_un.fecha = ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.validarNoDuplicadoXQuincena = (data) =>
  new Promise((resolve, reject) => {
    let sql;
    if (new Date(data.fecha).getUTCDate() > 14) {
      sql = mysql.format(
        "SELECT * FROM evaluacion_uniforme WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?)  GROUP BY fecha, idempleado",
        [data.empleado, data.fecha, data.fecha]
      );
    } else {
      let primerFechaMes = `${new Date(data.fecha).getFullYear()}-${
        new Date(data.fecha).getMonth() + 1
      }-1`;

      let quinceFechaMes = `${new Date(data.fecha).getFullYear()}-${
        new Date(data.fecha).getMonth() + 1
      }-15`;

      sql = mysql.format(
        `SELECT * FROM evaluacion_uniforme WHERE idempleado = ? AND fecha BETWEEN '${primerFechaMes}' AND '${quinceFechaMes}'  GROUP BY fecha, idempleado`,
        [data.empleado]
      );
    }
    console.log(sql);
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

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let iterar = data.evaluaciones.map((el) => [
      null,
      data.fecha,
      data.empleado,
      el.idCumplimiento,
      2,
      el.cumple,
    ]);
    console.log(iterar, "As");

    let sql = "INSERT INTO evaluacion_uniforme VALUES ?";

    connection.query(sql, [iterar], (err, res) => {
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

model.delete = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "DELETE FROM evaluacion_uniforme WHERE idempleado = ? AND fecha = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
