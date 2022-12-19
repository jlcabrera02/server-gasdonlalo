import bombaM from "../models/bomba.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await bombaM.find();
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await bombaM.findOne(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const { numBomba, bomba, estacionServicio } = req.body;

    const cuerpo = {
      num_bomba: numBomba,
      bomba,
      idestacion_servicio: Number(estacionServicio),
    };
    let response = await bombaM.insert(cuerpo);
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
    const { numBomba, bomba, estacionServicio } = req.body;

    const cuerpo = {
      num_bomba: numBomba,
      bomba,
      idestacion_servicio: Number(estacionServicio),
    };
    const data = [cuerpo, id];
    let response = await bombaM.update(data);
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
    let response = await bombaM.delete(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export default controller;
