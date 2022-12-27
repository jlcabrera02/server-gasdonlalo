import incumplimientoM from "../models/incumplimiento.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await incumplimientoM.find();
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.findXIdepartamento = async (req, res) => {
  try {
    const { idDepartamento } = req.params;
    console.log(idDepartamento);
    let response = await incumplimientoM.findXIdepartamento(idDepartamento);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const { incumplimiento } = req.body;
    const cuerpo = {
      incumplimiento: mayusxPalabra(incumplimiento),
    };
    let response = await incumplimientoM.insert(cuerpo);
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
    const { incumplimiento } = req.body;
    const cuerpo = {
      incumplimiento: mayusxPalabra(incumplimiento),
    };
    const data = [cuerpo, id];
    let response = await incumplimientoM.update(data);
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
    let response = await incumplimientoM.delete(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export default controller;
