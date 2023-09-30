import auth from "../models/auth.model";
import models from "../models";
const { Pagares, Auditoria, empleados } = models;
const { verificar } = auth;

const controller = {};
const area = "pagares";

controller.findPagare = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPagare } = req.params;

    const response = await Pagares.findByPk(idPagare, { include: empleados });

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findPagares = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { order, limit, offset } = req.query;

    const response = await Pagares.findAndCountAll({
      order: [["idpagare", order || "DESC"]],
      include: [{ model: empleados }],
      offset: offset ? Number(offset) : null,
      limit: limit ? Number(limit) || 10 : null,
    });

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertPagares = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, fecha, monto } = req.body;

    const response = await Pagares.create({
      idempleado: idEmpleado,
      fecha,
      monto,
    });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 2,
      idaffectado: response.dataValues.idpagare,
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

controller.updatePagares = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, fecha, monto } = req.body;
    const { idPagare } = req.params;

    const response = await Pagares.update(
      {
        idempleado: idEmpleado,
        fecha,
        monto,
      },
      { where: { idpagare: idPagare } }
    );

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idPagare,
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

controller.deletePagares = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPagare } = req.params;

    const response = await Pagares.destroy({ where: { idpagare: idPagare } });

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: idPagare,
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
