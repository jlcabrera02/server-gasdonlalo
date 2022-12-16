import estacionServiceM from "../models/estacionService.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await estacionServiceM.find();
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await estacionServiceM.findOne(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const { nombre, latitud, longitud, imagen } = req.body;
    const cuerpo = {
      nombre: mayusxPalabra(nombre),
      latitud,
      longitud,
      imagen,
    };
    let response = await estacionServiceM.insert(cuerpo);
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
    const { nombre, latitud, longitud, imagen } = req.body;
    const cuerpo = {
      nombre: mayusxPalabra(nombre),
      latitud,
      longitud,
      imagen,
    };
    const data = [cuerpo, id];
    let response = await estacionServiceM.update(data);
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
    let response = await estacionServiceM.delete(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export default controller;
