import auth from "../models/auth.model";
import mysql from "mysql2";
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
    const { idEmpleado } = req.params;
    let response = (await auth.findByIdEmpleado(idEmpleado)) || null;
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
    const { user } = req.params;
    let response = await auth.findPermisosXEmpleado(user);
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
    const { user, newPassword } = req.body;

    const cuerpo = [mysql.raw(`MD5('${newPassword}')`), user];
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
};

export default controller;
