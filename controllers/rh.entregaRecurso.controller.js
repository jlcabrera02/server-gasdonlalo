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
    console.log(req.body);

    const cuerpo = req.body.map((el) => [
      el.fecha,
      el.cantidad,
      el.recurso,
      el.idEmpleado,
      el.tipoRecibo,
      el.estado,
    ]);

    const response = await erM.insert(cuerpo);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.insertId,
    ]);

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

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    console.log(req.body);
    const { idRecurso } = req.params;

    const { fecha, cantidad, recurso, idEmpleado, tipoRecibo, estado } =
      req.body;

    const cuerpo = {
      fecha,
      cantidad,
      recurso,
      idempleado_recibe: idEmpleado,
      tipo_recibo: tipoRecibo,
      estado,
    };

    const response = await erM.update(cuerpo, idRecurso);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      idRecurso,
    ]);

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

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idRecurso } = req.params;

    const response = await erM.delete(idRecurso);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      4,
      idRecurso,
    ]);

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

export default controller;
