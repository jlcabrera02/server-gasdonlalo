import preM from "../models/l.preciogas.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import models from "../models/";
import { Op } from "sequelize";
const { Precios } = models;
const { verificar } = auth;

const controller = {};

controller.insertarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { P, M, D, fecha } = req.body;
    const idempleadoC = user.token.data.datos.idempleado;

    const cuerpo = [
      { idgas: "M", fecha, idempleado_captura: idempleadoC, precio: M },
      { idgas: "P", fecha, idempleado_captura: idempleadoC, precio: P },
      { idgas: "D", fecha, idempleado_captura: idempleadoC, precio: D },
    ];

    const response = await Precios.bulkCreate(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha } = req.query;
    let response;
    if (fecha) {
      response = await Precios.findAll({ where: { fecha } });
    } else {
      response = await Precios.findAll({
        order: [["createdAt", "DESC"]],
        limit: 3,
      });
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerPreciosHistoricos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fechaI, fechaF } = req.query;
    const querys = {};

    if (fechaF && fechaI) querys.fecha = { [Op.between]: [fechaI, fechaF] };

    const response = await Precios.findAll({
      where: querys,
      order: [["fecha", "ASC"]],
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

controller.actualizarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPrecio } = req.params;
    const { precio } = req.body;

    const idempleadoC = user.token.data.datos.idempleado;
    const cuerpo = {
      precio,
      idempleado_captura: idempleadoC,
    };

    const response = await Precios.update(cuerpo, {
      where: { idprecio: idPrecio },
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
