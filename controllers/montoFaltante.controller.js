import montoFaltanteM from "../models/montoFaltante.model";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await montoFaltanteM.find();
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await montoFaltanteM.findOne(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      empleado: Number(empleado),
    };
    let response = await montoFaltanteM.insert(cuerpo);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      empleado: Number(empleado),
    };
    const data = [cuerpo, id];
    let response = await montoFaltanteM.update(data);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await montoFaltanteM.delete(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export default controller;
