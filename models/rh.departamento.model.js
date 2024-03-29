import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
const { errorDB, sinRegistro, sinCambios, peticionImposible } = resErr;

const model = {};

model.find = () =>
  new Promise((resolve, reject) => {
    let sql = "SELECT * FROM departamento WHERE iddepartamento > 0";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.insert = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO departamento VALUES (null, ?)";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.changedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.update = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "UPDATE departamento SET departamento = ? WHERE iddepartamento = ?";

    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.delete = (id) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM departamento WHERE iddepartamento = ?";

    connection.query(sql, id, (err, res) => {
      console.log(err);

      if (err) {
        if (err.errno === 1451) {
          return reject(
            peticionImposible(
              "No puedes eliminar el departamento por que hay empleados dentro de esta categoría"
            )
          );
        }
        return reject(errorDB());
      }
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

export default model;
