import auth from "../models/auth.model";
import models from "../models/";
import {
  escribirConfiguraciones,
  obtenerConfiguraciones,
} from "../services/configuracionesPersonalizables";
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

//---Mantenimiento

controller.configurarCUMantenimiento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { identificador } = req.body;

    const codigoUso = await CodigosUso.findOne({
      where: { idcodigo_uso: identificador },
    });

    const configCU =
      obtenerConfiguraciones().configLiquidacion.codigoUsoMantenimiento;
    const editar = escribirConfiguraciones({
      configLiquidacion: {
        codigoUsoMantenimiento: [
          ...configCU,
          { identificador, descripcion: codigoUso.dataValues.descripcion },
        ],
      },
    });

    res.status(200).json({ success: true, response: true });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerCodigoUsoMantenimiento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response =
      obtenerConfiguraciones().configLiquidacion.codigoUsoMantenimiento;

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.eliminarCUMantenimiento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { identificador } = req.query;

    const configCU =
      obtenerConfiguraciones().configLiquidacion.codigoUsoMantenimiento;

    const configuracionesRestantes = configCU.filter(
      (el) => el.identificador !== identificador
    );

    const eliminar = escribirConfiguraciones({
      configLiquidacion: {
        codigoUsoMantenimiento: configuracionesRestantes,
      },
    });

    res.status(200).json({ success: true, response: true });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
