import auth from "../models/auth.model";
import models from "../models/";
import { Op } from "sequelize";
const { Precios, Auditoria } = models;
const { verificar } = auth;

const controller = {};

controller.insertarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { P, M, D, fecha, horaAccionar } = req.body;
    const idempleadoC = user.token.data.datos.idempleado;

    if (!horaAccionar)
      throw { success: false, msg: "Falta el campo de turno", code: 400 };

    const newFecha = `${fecha} ${horaAccionar}`;

    const cuerpo = [
      {
        idgas: "M",
        fecha: newFecha,
        idempleado_captura: idempleadoC,
        precio: M,
      },
      {
        idgas: "P",
        fecha: newFecha,
        idempleado_captura: idempleadoC,
        precio: P,
      },
      {
        idgas: "D",
        fecha: newFecha,
        idempleado_captura: idempleadoC,
        precio: D,
      },
    ];

    const response = await Precios.bulkCreate(cuerpo);

    const auditoriaC = response.map((el) => ({
      peticion: "Precios Combustible",
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: el.dataValues.idprecio,
    }));

    await Auditoria.bulkCreate(auditoriaC);

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      if (err.parent.errno === 1292) {
        res
          .status(400)
          .json({ msg: "Al parecer estas enviando una fecha invalida" });
      } else {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      }
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerPrecios = async (req, res) => {
  try {
    // let user = verificar(req.headers.authorization);
    // if (!user.success) throw user;
    const { fechaAnterior, hora } = req.query;
    const querys = {};

    if (fechaAnterior && !hora) {
      querys.fecha = { [Op.lte]: fechaAnterior };
    }

    if (hora) {
      querys.fecha = { [Op.lt]: `${fechaAnterior} ${hora}` };
    }

    const response = await Precios.findAll({
      where: querys,
      order: [
        ["fecha", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit: 3,
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

    await Auditoria.create({
      peticion: "Precios combustible",
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idPrecio,
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

controller.eliminarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPrecios } = req.query;

    const response = await Precios.destroy({
      where: { idprecio: { [Op.in]: idPrecios } },
    });

    const cuerpo = idPrecios.map((el) => ({
      peticion: "Precios combustible",
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: el,
    }));

    await Auditoria.bulkCreate(cuerpo);

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
