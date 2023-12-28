import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import mysql from "mysql2";
const { errorDB, sinRegistro, sinCambios, datosExistentes } = resErr;

const model = {};

const tiempoLocal = (date) =>
  new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60000);

model.findByIdentificador = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT rd.*, r.recurso FROM recurso_despachador rd, recurso r WHERE rd.idrecurso = r.idrecurso AND rd.identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (idRecursoDespachador) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT * FROM recurso_despachador WHERE idrecurso_despachador = ?";

    connection.query(sql, idRecursoDespachador, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });
/* 
//Obtiene todas las evaluaciones del empleado por el periodo de tiempo que le asignemos
model.findListRecursosXmes = (fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, sum(evaluacion) AS total, pm.puntaje AS limite_minimo, MONTHNAME(?) AS mes, emp.idempleado FROM recurso_despachador rd, empleado emp, puntaje_minimo pm WHERE emp.idempleado = rd.idempleado AND rd.idrecurso_minimo = pm.idpuntaje_minimo AND rd.fecha BETWEEN ? AND LAST_DAY(?) GROUP BY emp.idempleado`;

    connection.query(sql, [fecha, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });
 */
model.findListRecursosXmesXidEmpleado = (id, fecha) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, AVG(rd.evaluacion) promedio, COUNT(*) totalEv FROM (SELECT * FROM recurso r, empleado emp) r LEFT JOIN recurso_despachador rd ON rd.idrecurso = r.idrecurso AND rd.idempleado = r.idempleado WHERE r.idempleado = ? AND rd.fehca = ? GROUP BY r.idrecurso`;

    connection.query(sql, [id, fecha, fecha], (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

/* model.findListRecursosXmesXidEmpleadoXquincena = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT rd.*, r.recurso, CONCAT(emp.nombre, " ", emp.apellido_paterno, " ", emp.apellido_materno) AS nombre_completo, emp.nombre, emp.apellido_paterno, apellido_materno FROM (SELECT *, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM recurso_despachador) AS rd, empleado emp, recurso r WHERE rd.idempleado = emp.idempleado AND r.idrecurso = rd.idrecurso AND rd.idempleado = ? AND rd.quincena = ? AND rd.fecha between ? AND LAST_DAY(?)`;
    connection.query(sql, [...data, data[2]], (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  }); */

model.findAllXQuicena = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, AVG(rd.evaluacion) promedio, COUNT(*) totalEv FROM (SELECT * FROM recurso r, empleado emp) r LEFT JOIN (SELECT *, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM recurso_despachador WHERE fecha BETWEEN ? AND LAST_DAY(?)) rd ON rd.idrecurso = r.idrecurso AND rd.idempleado = r.idempleado WHERE r.idempleado = ? AND quincena = ? GROUP BY r.idrecurso`;
    // ["2023-01-01", "2023-01-01", idEmpleado, quincena]
    connection.query(sql, data, (err, res) => {
      console.log(err);

      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findAllXMes = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT *, AVG(rd.evaluacion) promedio, COUNT(*) totalEv FROM (SELECT * FROM recurso r, empleado emp) r LEFT JOIN (SELECT *, CASE WHEN DAY(fecha) < 16 THEN 1 WHEN DAY(fecha) > 15 THEN 2 END AS quincena FROM recurso_despachador WHERE fecha BETWEEN ? AND LAST_DAY(?)) rd ON rd.idrecurso = r.idrecurso AND rd.idempleado = r.idempleado WHERE r.idempleado = ? GROUP BY r.idrecurso`;
    // ["2023-01-01", "2023-01-01", idEmpleado, quincena]
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res);
    });
  });

model.findPuntajeMinimo = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql = "SELECT * FROM puntaje_minimo WHERE idpuntaje_minimo = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.findRecursos = (id) =>
  new Promise((resolve, reject) => {
    //funcion validara si el empleado ya tiene recoleccion de efectivo de ese dia
    let sql = "SELECT * FROM recurso";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

/* model.validarNoDuplicadoXQuincena = (data) =>
  new Promise((resolve, reject) => {
    let quinceFechaMes = `${tiempoLocal(data.fecha).getFullYear()}-${
      tiempoLocal(data.fecha).getMonth() + 1
    }`;
    let sql;
    if (tiempoLocal(data.fecha).getUTCDate() > 15) {
      quinceFechaMes += "-16";
      sql = mysql.format(
        "SELECT * FROM recurso_despachador WHERE idempleado = ? AND fecha BETWEEN ? AND LAST_DAY(?)  GROUP BY fecha, idempleado",
        [data.empleado, quinceFechaMes, data.fecha]
      );
    } else {
      quinceFechaMes += "-15";
      let primerFechaMes = `${tiempoLocal(data.fecha).getFullYear()}-${
        tiempoLocal(data.fecha).getMonth() + 1
      }-01`;

      sql = mysql.format(
        `SELECT * FROM recurso_despachador WHERE idempleado = ? AND fecha BETWEEN '${primerFechaMes}' AND '${quinceFechaMes}'  GROUP BY fecha, idempleado`,
        [data.empleado]
      );
    }

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false);
      if (res)
        return reject(
          datosExistentes(
            "Ya hay un registro para el usuario en el intervalo de tiempo correspondiente"
          )
        );
    });
  }); */

model.findXTiempoGroup = (data) =>
  new Promise((resolve, reject) => {
    let sql;
    if (data.length > 2) {
      sql =
        "SELECT identificador FROM recurso_despachador WHERE idempleado = ? AND fecha BETWEEN ? AND ? GROUP BY identificador ORDER BY fecha";
    } else {
      sql =
        "SELECT identificador FROM recurso_despachador WHERE idempleado = ? GROUP BY identificador ORDER BY fecha";
    }

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findXid = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT rcd.*, emp.nombre, emp.apellido_paterno, emp.apellido_materno, CASE WHEN DAY(rcd.fecha) < 16 THEN 1 WHEN DAY(rcd.fecha) > 15 THEN 2 END AS quincena FROM recurso_despachador rcd, empleado emp WHERE emp.idempleado = rcd.idempleado AND rcd.identificador = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

//No borrar porque la utilizo para la boleta quincenal de despachadores
model.findXMesXEmpleadoEv = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT SUM(evaluacion) total, COUNT(*) todo FROM recurso_despachador WHERE fecha BETWEEN ? AND ? AND idempleado = ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO recurso_despachador (fecha, idempleado, idrecurso, idrecurso_minimo, evaluacion, identificador) VALUES ?";

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
        "UPDATE recurso_despachador SET evaluacion = ? WHERE idrecurso_despachador = ? AND idempleado = ?; ",
        query
      );
    });

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (data) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM recurso_despachador WHERE identificador = ?";
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
