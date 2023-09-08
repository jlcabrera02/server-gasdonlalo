import auth from "../models/auth.model";
import models from "../models";
import { buscarLecturasXIdEmpleado } from "./l.lecturas.controller";
const { Auditoria, ES, ControlVol } = models;
const { verificar } = auth;

//Controlador para datos de control volumetrico

const controller = {};
const area = "Control Volumérico";

controller.obtenerControlV = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { order, limit, offset } = req.query;

    const response = await ControlVol.findAndCountAll({
      order: [["idcontrol_volumetrico", order || "DESC"]],
      include: [{ model: ES }],
      offset: offset ? Number(offset) : null,
      limit: limit ? Number(limit) || 10 : null,
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

controller.comparacion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha } = req.query;

    const controlV = await ControlVol.findAll({
      where: { fecha },
    });
    const liquidaciones = await buscarLecturasXIdEmpleado({
      filtro: "capturado",
      fechaF: fecha,
      fechaI: fecha,
    });

    const response = { controlvolumetrico: controlV, liquidaciones };

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "Error al obtener la consulta" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.capturarControlV = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { litros, fecha, idEstacion } = req.body;

    const response = await ControlVol.create({
      fecha,
      idestacion_servicio: idEstacion,
      litros,
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: response.dataValues.idcontrol_volumetrico,
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

controller.editarControlV = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha, litros, idEstacion } = req.body;
    const { idControl } = req.params;

    const response = await ControlVol.update(
      {
        litros,
        idestacion_servicio: idEstacion,
        fecha,
      },
      {
        where: {
          idcontrol_volumetrico: idControl,
        },
      }
    );

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idControl,
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

controller.eliminarControlV = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idControl } = req.params;

    const response = await ControlVol.destroy({
      where: {
        idcontrol_volumetrico: idControl,
      },
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: idControl,
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
