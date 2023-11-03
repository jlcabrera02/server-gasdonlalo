import { Op } from "sequelize";
import modelos from "../../models/";
import auth from "../../models/auth.model";
const { verificar } = auth;
const { PanicBtn, empleados, Islas, ES } = modelos;

const controller = {};

controller.buscarDetalles = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { order, limit, offset, idIsla, idEstacionS, fechaI, fechaF } =
      req.query;
    const querys = { activo: false };

    if (idIsla) querys.idisla = Number(idIsla);
    if (idEstacionS) querys.idestacion_servicio = Number(idEstacionS);
    if (fechaI && fechaF) querys.createdAt = { [Op.between]: [fechaI, fechaF] };

    const response = await PanicBtn.findAndCountAll({
      where: querys,
      order: [["idpanic_btn", order || "DESC"]],
      include: [{ model: empleados }, { model: Islas, include: ES }],
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

controller.addDescripcion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPanic } = req.params;
    const { descripcion } = req.body;

    const response = await PanicBtn.update(
      { descripcion },
      { where: { idpanic_btn: idPanic } }
    );

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
