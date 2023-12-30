import modelos from "../../models";
import auth from "../../models/auth.model";
import sequelize from "../../config/configdb";
const { verificar } = auth;
const { AT } = modelos;

const controller = {};

controller.crearAreaT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { area } = req.body;

    const response = await AT.create({ area });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerAreaT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const response = await AT.findAll();

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

controller.editarArea = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idarea } = req.params;
    const { area } = req.body;

    const response = await AT.update(
      { area: area },
      { where: { idarea: idarea } }
    );

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

controller.eliminarArea = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idarea } = req.params;

    const response = await AT.destroy({ where: { idarea: idarea } });

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
