import connection from "./connection";
import resErr from "../respuestas/error.respuestas";
import Jwt from "jsonwebtoken";
import { config } from "dotenv";
config(); //

const { errorDB, sinRegistro, errorLogin, sinCambios } = resErr;

const model = {};

model.findPermisosByUser = (user) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT permiso.*, at.area FROM acceso, permiso, area_trabajo at WHERE acceso.idpermiso = permiso.idpermiso AND permiso.idarea_trabajo = at.idarea_trabajo AND user = ? ORDER BY permiso.idarea_trabajo";

    connection.query(sql, user, (err, res) => {
      if (err) return reject(errorDB());
      if (res.length < 1) return reject(errorLogin());
      if (res) return resolve(res);
    });
  });

model.findPermisos = (user) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT permiso.*, at.area FROM permiso, area_trabajo at WHERE permiso.idarea_trabajo = at.idarea_trabajo AND idpermiso > 1 ORDER BY permiso.idarea_trabajo";

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

model.findByIdEmpleado = (id) =>
  new Promise((resolve, reject) => {
    let sql =
      "SELECT emp.*, user.username FROM empleado emp LEFT JOIN user ON user.idempleado = emp.idempleado WHERE user.idempleado = ?";

    connection.query(sql, id, (err, res) => {
      if (err) return reject(errorDB());
      if (res) return resolve(res[0]);
    });
  });

model.findPermisosXEmpleado = (id) =>
  new Promise((resolve, reject) => {
    let sql = `SELECT permiso.*, at.area, acc.user FROM area_trabajo at, permiso LEFT JOIN (SELECT * FROM acceso, user WHERE user.username = acceso.user AND user.idempleado = ?) acc ON permiso.idpermiso = acc.idpermiso WHERE at.idarea_trabajo = permiso.idarea_trabajo AND permiso.idpermiso > 1`;

    connection.query(sql, id, (err, res) => {
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
    let sql = "INSERT INTO acceso (user, idpermiso) VALUE ?";
    connection.query(sql, [data], (err, res) => {
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
    let sql = "DELETE FROM acceso WHERE user = ? AND idpermiso IN (?)";
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

model.changePass = (data) =>
  new Promise((resolve, reject) => {
    let sql = `UPDATE user SET password = ? WHERE username = ?`;
    connection.query(sql, data, (err, res) => {
      if (err) return reject(errorDB());
      if (res.affectedRows < 1) return reject(sinCambios());
      if (res) return resolve(res);
    });
  });

model.generarToken = (datos, permisos) => {
  const payload = {
    check: true,
    data: { datos, permisos },
  };

  const token = Jwt.sign(payload, process.env.PASSWORD_DB, {
    expiresIn: 60 * 60 * 12, //Equivale a 12 horas para que el token sea válido
  });

  return {
    msg: "autenticado",
    token,
  };
};

model.verificar = (header, idPer = null) => {
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
      let acceso = true;

      if (idPer) {
        acceso = tokenCall.data.permisos.some(
          (el) => el[0] === 1 || el[0] === idPer
        );
        // console.log(tokenCall.data.permisos);
      }

      if (acceso) {
        response = {
          success: true,
          msg: "token válido",
          token: tokenCall,
          acceso,
        };
      } else {
        response = {
          success: false,
          code: 400,
          msg: "No hay autorización para usar la peticion",
          acceso,
        };
      }
    }
  });

  return response;
};

export default model;
