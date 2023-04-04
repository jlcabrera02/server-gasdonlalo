import erM from "../models/rh.entregaRecursos.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};
const area = "Entrega Recursos";

controller.findRecursos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const response = await erM.findRecursos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findRecursosXId = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEntregaRecurso } = req.params;
    const response = await erM.findRecursosXId(idEntregaRecurso);
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
    const { fecha, idEmpleado, cantidad, recurso, tipo } = req.body;
    const cuerpo = {
      fecha,
      idempleado_recibe: Number(idEmpleado),
      cantidad: Number(cantidad),
      recurso,
      tipo_recibo: Number(tipo),
    };
    const response = await erM.insert(cuerpo);
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

export default controller;
