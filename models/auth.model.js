import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import Jwt from "jsonwebtoken";
import { config } from "dotenv";
config(); //

const { errorDB, sinRegistro, errorLogin } = resErr;

const model = {};

model.findPermisos = (user) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT permiso.* FROM acceso, permiso WHERE acceso.idpermiso = permiso.idpermiso AND user = ?";

    connection.query(sql, user, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(errorLogin());
      if (res) return resolve(res);
    });
  });

model.findAll = () =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT emp.*, user.username FROM empleado emp LEFT JOIN user ON user.idempleado = emp.idempleado";

    connection.query(sql, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(errorLogin());
      if (res) return resolve(res);
    });
  });

model.findPermisosXEmpleado = (crendentials) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT permiso.*, acc.user FROM permiso LEFT JOIN (SELECT * FROM acceso WHERE acceso.user = ?) acc ON permiso.idpermiso = acc.idpermiso WHERE permiso.idpermiso > 1`;

    connection.query(sql, crendentials, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(errorLogin());
      if (res) return resolve(res);
    });
  });

model.login = (crendentials) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT emp.*, u.username from user u, empleado emp WHERE u.idempleado = emp.idempleado AND u.username = ? AND u.password = MD5(?)";

    connection.query(sql, crendentials, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(errorLogin());
      if (res) return resolve(res[0]);
    });
  });

model.registerPermisos = (data) =>
  new Promise((resolve, reject) => {
    let sql = "INSERT INTO acceso (user, idpermiso) VALUE (?, ?)";
    connection.query(sql, data, (err, res) => {
      console.log(err);
      if (err) {
        if (err.errno === 1062) return reject(errorDB("Ya existe el usuario"));
        return reject(errorDB());
      }
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.quitarPermisos = (data) =>
  new Promise((resolve, reject) => {
    let sql = "DELETE FROM acceso WHERE user = ? AND idpermiso = ?";
    connection.query(sql, data, (err, res) => {
      console.log(res);
      if (err) {
        if (err.errno === 1062) return reject(errorDB("Ya existe el usuario"));
        return reject(errorDB());
      }
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.register = (data) =>
  new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO user (username, password, idempleado) VALUE (?, ?, ?)";
    connection.query(sql, data, (err, res) => {
      if (err) {
        if (err.errno === 1062)
          return reject(
            errorDB(
              "Ya existe el usuario el nombre de usuario, por favor escojer otro"
            )
          );
        return reject(errorDB());
      }
      if (res.length < 1) return reject(sinRegistro());
      if (res) return resolve(res);
    });
  });

model.generarToken = (datos) => {
  const payload = {
    check: true,
    data: datos,
  };

  const token = Jwt.sign(payload, process.env.PASSWORD_DB, {
    expiresIn: 60 * 60 * 12, //Equivale a 12 horas para que el token sea válido
  });

  return {
    msg: "autenticado",
    token,
  };
};

model.verificar = (header, permisos = []) => {
  if (!header) {
    return {
      success: false,
      code: 403,
      msg: "No se ha recibido llave de autorización",
    };
  }

  let token = header.replace("Bearer ", "");
  let response;
  Jwt.verify(token, process.env.PASSWORD_DB, (err, tokenCall) => {
    if (err) {
      response = {
        success: false,
        code: 401,
        msg: "Token inválido o caduco",
        acceso: false,
      };
    } else {
      let acceso = false;

      if (permisos.length > 0) {
        for (let el in permisos) {
          if (roles[permisos[el]]) {
            acceso = true;
            break;
          }
        }
      }

      response = {
        success: true,
        msg: "token válido",
        token: tokenCall,
        acceso,
      };
    }
  });

  return response;
};

export default model;
