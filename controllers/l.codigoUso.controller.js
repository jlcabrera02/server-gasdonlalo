import auth from "../models/auth.model";
import models from "../models/";
const { CodigosUso, Auditoria } = models;
const { verificar } = auth;

const controller = {};
const area = "Codigos de uso";

controller.obtenerCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await CodigosUso.findAll();

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.nuevoCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { id, descripcion } = req.body;

    const response = await CodigosUso.create({
      idcodigo_uso: id,
      descripcion: descripcion.trim(),
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: response.dataValues.idcodigo_uso,
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

controller.editarCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { descripcion } = req.body;
    const { idCodigoUso } = req.params;

    const response = await CodigosUso.update(
      {
        descripcion: descripcion.trim(),
      },
      {
        where: {
          idcodigo_uso: idCodigoUso,
        },
      }
    );

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idCodigoUso,
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

controller.eliminarCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idCodigoUso } = req.params;

    const response = await CodigosUso.destroy({
      where: {
        idcodigo_uso: idCodigoUso,
      },
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: idCodigoUso,
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

export default controller;
