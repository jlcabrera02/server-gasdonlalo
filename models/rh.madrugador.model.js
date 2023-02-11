import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, datosExistentes } = resErr;

const model = {};

model.findPuntajeMes = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT puntaje FROM puntaje_minimo WHERE idpuntaje_minimo = 4`;
    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0].puntaje);
    });
  });

model.findDepartamentosByMadrugador = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT dep.*, c.idconcurso FROM concurso c, departamento dep WHERE c.iddepartamento = dep.iddepartamento AND c.concurso = 1 GROUP BY dep.iddepartamento`;
    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return sinRegistro();
      if (res) return resolve(res);
    });
  });

model.validarNoDuplicados = (iddepartamento) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT * FROM concurso WHERE iddepartamento = ?`;
    connection.query(sql, iddepartamento, (err, res) => {
      console.log({ res });
      if (err) return reject(errorDB());
      if (res.length < 1) return resolve(true);
      if (res) return reject(datosExistentes());
    });
  });

model.findTipoFalta = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total FROM captura_entrada WHERE idtipo_falta = ? AND idempleado = ? AND fecha = ?`;
    //[idTipoFalta, idempleado, fecha]
    //TipoFalta - 4 falta - 5 retardo - 7 entrada/salida-
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.findSN = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total FROM salida_noconforme WHERE idempleado = ? AND fecha = ? AND idincumplimiento = ?`;
    //[idTipoFalta, idempleado, fecha]
    //TipoFalta - 4 falta - 5 retardo - 7 entrada/salida-
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0].total);
    });
  });

model.findChecksBomba = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total FROM (SELECT * FROM checklist_bomba WHERE idempleado_entrante = ? AND fecha = ?) AS chk WHERE isla_limpia = 0 OR aceites_completos = 0`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

model.insertDepartamento = (idDepartamento) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO concurso (concurso, iddepartamento) VALUE (1, ?)";

    connection.query(sql, idDepartamento, (err, res) => {
      console.log(err);
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
