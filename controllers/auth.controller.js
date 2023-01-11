import auth from "../models/auth.model";
import mysql from "mysql2";

const controller = {};

controller.login = async (req, res) => {
  try {
    const { user, password } = req.body;
    const cuerpo = [user, password];
    let userData = await auth.login(cuerpo);
    let token = auth.generarToken(userData);
    res.status(200).json({ success: true, auth: userData, token });
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
    const cuerpo = [user, mysql.raw(`MD5(${password})`), Number(idEmpleado)];
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

controller.as = async (req, res) => {
  try {
    const { token } = req.body;
    let response = auth.verificar(token);
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
