import erM from "../models/rh.entregaRecursos.model";
import tp from "../assets/formatTiempo";
const { tiempoDB, transformMinute, diff } = tp;

const controller = {};

controller.findRecursos = async (req, res) => {
  try {
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
    const { fecha, idEmpleado, cantidad, recurso } = req.body;
    const cuerpo = {
      fecha,
      idempleado: Number(idEmpleado),
      cantidad: Number(cantidad),
      recurso,
    };
    const response = await erM.insert(cuerpo);
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
