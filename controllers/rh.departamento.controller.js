import departamentoM from "../models/rh.departamento.model";
import { guardarBitacora } from "../models/auditorias";
import mayusxPalabra from "./formatearText.controller";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};
const area = "Departamentos";

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let response = await departamentoM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const departamento = mayusxPalabra(req.body.departamento);
    let response = await departamentoM.insert(departamento);
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.insertId,
    ]);
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { id } = req.params;
    const departamento = mayusxPalabra(req.body.departamento);
    const data = [departamento, id];
    let response = await departamentoM.update(data);
    await guardarBitacora([area, user.token.data.datos.idempleado, 3, id]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { id } = req.params;
    let response = await departamentoM.delete(id);
    await guardarBitacora([area, user.token.data.datos.idempleado, 4, id]);
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
