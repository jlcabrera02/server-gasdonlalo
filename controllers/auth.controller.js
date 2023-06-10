import auth from "../models/auth.model";
import mysql from "mysql2";
import models from "../models";
import formatTiempo from "../assets/formatTiempo";
import { Op } from "sequelize";
import sequelize from "../config/configdb";
const { LlaveAcceso, empleados, Auditoria } = models;
const { verificar } = auth;

const controller = {};

controller.login = async (req, res) => {
  try {
    const { user, password } = req.body;
    const cuerpo = [user, password];
    const userData = await auth.login(cuerpo);
    const permisos = await auth.findPermisosByUser(user);
    const permisosId = permisos.map((el) => [el.idpermiso, el.idarea_trabajo]);
    const token = auth.generarToken(userData, permisosId);

    await Auditoria.create({
      peticion: "Inicio de sesión",
      idempleado: userData.idempleado,
      accion: 1,
      idaffectado: userData.idempleado,
    });

    res.status(200).json({
      success: true,
      auth: userData,
      token,
      permisos: permisosId,
      permisosGeneral: permisos,
    });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.AccessLlaveAcceso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { key, mangueras } = req.body;
    const response = await LlaveAcceso.findOne({
      where: { key },
      include: empleados,
    });
    if (!response) throw { code: 403, msg: "No autorizado", success: false };

    const auditoriaC = mangueras.map((el) => ({
      peticion: "Autorización Reinicio Lectura",
      idempleado: response.dataValues.empleado.idempleado,
      accion: 2,
      idaffectado: el,
    }));

    await Auditoria.bulkCreate(auditoriaC);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.RemoveLlaveAcceso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 1);
    if (!user.success) throw user;
    const { key } = req.params;
    const response = await LlaveAcceso.destroy({
      where: { key },
    });

    await Auditoria.create({
      peticion: "Llave de acceso",
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: key,
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.ListLlaveAcceso = async (req, res) => {
  try {
    const response = await LlaveAcceso.findAll({
      include: empleados,
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.CreateLlaveAcceso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 1);
    if (!user.success) throw user;
    const { key, idempleado } = req.body;
    const response = await LlaveAcceso.create({ idempleado, key });
    await Auditoria.create({
      peticion: "Llave de acceso",
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: response.key,
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findPermisos = async (req, res) => {
  try {
    let response = await auth.findPermisos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.registerPermisos = async (req, res) => {
  try {
    const { user, permiso } = req.body;
    const cuerpo = permiso.map((el) => [user, el]);
    let response = await auth.registerPermisos(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.quitarPermisos = async (req, res) => {
  try {
    const { user, permiso } = req.body;
    const permisos = permiso.map((el) => Number(el));
    const cuerpo = [user, permisos];
    let response = await auth.quitarPermisos(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.register = async (req, res) => {
  try {
    const { user, password, idEmpleado } = req.body;
    const cuerpo = [user, mysql.raw(`MD5('${password}')`), Number(idEmpleado)];
    let response = await auth.register(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findAll = async (req, res) => {
  try {
    let response = await auth.findAll();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findByIdEmpleado = async (req, res) => {
  try {
    const { idChecador } = req.params;
    let response = (await auth.findByIdEmpleado(idChecador)) || null;
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findPermisosXEmpleado = async (req, res) => {
  try {
    const { idChecador } = req.params;
    let response = await auth.findPermisosXEmpleado(idChecador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.validarTiempoSesion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    res.status(200).json({ success: true, msg: "Token correcto" });
  } catch (err) {
    res.status(err.code).json(err);
  }
};

controller.changePass = async (req, res) => {
  try {
    const { user, newPassword, password } = req.body;

    const cuerpo = [
      mysql.raw(`MD5('${newPassword}')`),
      mysql.raw(`MD5('${password}')`),
      user,
    ];
    let response = await auth.changePass(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.changePassAdmin = async (req, res) => {
  try {
    const { user, newPassword } = req.body;

    const cuerpo = [mysql.raw(`MD5('${newPassword}')`), user];

    let response = await auth.changePassAdmin(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      console.log(err);
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.infoAuditorias = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { nDias } = req.query;
    const hoy = new Date(),
      year = hoy.getFullYear(),
      month = hoy.getMonth(),
      date = hoy.getDate();
    const fecha = new Date(year, month, date);

    if (nDias) {
      fecha.setDate(fecha.getDate() - nDias);
    }

    const response = await Auditoria.findAll({
      where: {
        create_time: sequelize.where(
          sequelize.fn("DATE", sequelize.col("create_time")),
          {
            [Op.gte]: fecha,
          }
        ),
      },
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      console.log(err);
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

/* 
controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { numBomba, bomba, estacionServicio } = req.body;

    const cuerpo = {
      num_bomba: numBomba,
      bomba,
      idestacion_servicio: Number(estacionServicio),
    };
    const data = [cuerpo, id];
    let response = await auth.update(data);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
}; */

export default controller;
