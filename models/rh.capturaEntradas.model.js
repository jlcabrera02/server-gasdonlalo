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

//Funcion principal de reportes
model.findRetardosXsemanas = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM captura_entrada WHERE idempleado = ? AND fecha BETWEEN ? AND ? ORDER BY fecha`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findOne = (idCap) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ce.* FROM captura_entrada ce WHERE ce.idcaptura_entrada = ?`;

    connection.query(sql, idCap, (err, res) => {
      // console.log(err);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.findTurno = (idturno) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM turno WHERE idturno = ?`;

    connection.query(sql, idturno, (err, res) => {
      // console.log(err);

      if (err) return reject(errorDB());
      if (res.length < 1) resolve(false);
      if (res) return resolve(res);
    });
  });

model.findTurnos = (idturno) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM turno`;

    connection.query(sql, idturno, (err, res) => {
      // console.log(err);
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.findFaltas = async (idFalta) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM tipo_falta WHERE idtipo_falta = ?`;

    connection.query(sql, idFalta, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro("No se encontro faltas"));
      if (res) return resolve(res);
    });
  });

model.validarDuplicados = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT ce.idcaptura_entrada FROM captura_entrada ce WHERE idempleado = ? AND fecha = ? AND hora_establecida = ?`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(false);
      if (res)
        return reject(
          datosExistentes(
            "Ya se capturo entrada para el empleado con la misma fecha y mismo turno"
          )
        );
    });
  });

model.findFalta = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM tipo_falta WHERE idtipo_falta > 1`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
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
    let sql = "UPDATE captura_entrada SET ? WHERE idcaptura_entrada = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.insertTurnos = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO turno (turno, hora_anticipo, hora_empiezo, hora_termino) VALUES (?,?,?,?)";

    connection.query(sql, data, (err, res) => {
      console.log(data);
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.updateTurnos = (data) =>
  new Promise((resolve, reject) => {
    let sql = "UPDATE turno SET ? WHERE idturno = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.deleteTurno = (idTurno) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM turno WHERE idturno = ?";

    connection.query(sql, idTurno, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (idCaptura) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM captura_entrada WHERE idcaptura_entrada = ?";

    connection.query(sql, idCaptura, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
