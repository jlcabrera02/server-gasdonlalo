import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro } = resErr;

const model = {};

model.findPuntajeMes = () =>
  new Promise((resolve, reject) => {
    let sql = `SELECT puntaje FROM puntaje_minimo WHERE idpuntaje_minimo = 4`;
    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0].puntaje);
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

model.findChecksBomba = (data) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) total FROM (SELECT * FROM checklist_bomba WHERE idempleado_entrante = ? AND fecha = ?) AS chk WHERE isla_limpia = 0 OR aceites_completos = 0`;

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res[0]);
    });
  });

export default model;
