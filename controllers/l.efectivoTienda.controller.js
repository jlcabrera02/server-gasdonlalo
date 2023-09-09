import auth from "../models/auth.model";
import models from "../models";
const { EfectivoTienda, Auditoria, empleados, ES, CodigosUso } = models;
const { verificar } = auth;

//Controlador para capturar efectivos de tienda.

const controller = {};
const area = "Efectivo Tienda";

controller.obtenerEfectivoTienda = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { order, limit, offset } = req.query;

    const response = await EfectivoTienda.findAndCountAll({
      order: [["idefectivo", order || "DESC"]],
      include: [
        {
          model: ES,
        },
        { model: empleados },
      ],
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

controller.obtenerReporte = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, fecha, idEstacion } = req.query;
    const querys = {};

    if (fecha) {
      querys.fecha = fecha;
    }

    if (idEmpleado) {
      querys.idempleado = idEmpleado;
    }

    if (idEstacion) {
      querys.idestacion_servicio = idEstacion;
    }

    const response = await EfectivoTienda.findAll({
      where: querys,
      include: [
        {
          model: empleados,
        },
        { model: ES },
        { model: CodigosUso },
      ],
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

controller.capturarEfectivoTienda = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idCodigoUso, monto, folio, fecha, idEmpleado, idEstacion } =
      req.body;

    const response = await EfectivoTienda.create({
      idcodigo_uso: idCodigoUso,
      fecha,
      idempleado: idEmpleado,
      idestacion_servicio: idEstacion,
      monto,
      folio,
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: response.dataValues.idefectivo,
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

controller.editarEfectivo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idCodigoUso, monto, folio, fecha, idEmpleado, idEstacion } =
      req.body;
    const { idefectivo } = req.params;

    const response = await EfectivoTienda.update(
      {
        idcodigo_uso: idCodigoUso,
        monto,
        folio,
        idempleado: idEmpleado,
        idestacion_servicio: idEstacion,
        fecha,
      },
      {
        where: {
          idefectivo,
        },
      }
    );

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idefectivo,
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

controller.eliminarEfectivo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idefectivo } = req.params;

    const response = await EfectivoTienda.destroy({
      where: {
        idefectivo,
      },
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: idefectivo,
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
