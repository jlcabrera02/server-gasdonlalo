import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, peticionImposible } = resErr;

const model = {};

model.findOneById = (data) =>
  new Promise((resolve, reject) => {
    let sql;
    if (data.hasOwnProperty("idtext")) {
      sql = `SELECT * FROM ${data.table} WHERE ${data.idtext} = "${data.id}"`;
    } else {
      sql = `SELECT * FROM ${data.table} WHERE id${data.table} = ${data.id}`;
    }

    connection.query(sql, (err, res) => {
      if (err) {
        if (err.errno === 1146)
          return reject(peticionImposible("No existen los elementos"));
        return reject(errorDB());
      }
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

export default model;
