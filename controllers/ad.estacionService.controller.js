import estacionServiceM from "../models/ad.estacionService.model";
import mayusxPalabra from "./formatearText.controller";
import models from "../models";
const { ES, Islas } = models;

const controller = {};

controller.findTurnos = async (req, res) => {
  try {
    const { idEstacion } = req.params;
    let response = await estacionServiceM.findTurnos(idEstacion);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findAllTurnos = async (req, res) => {
  try {
    let response = await estacionServiceM.findAllTurnos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.find = async (req, res) => {
  try {
    let response = await estacionServiceM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findAllES = async (req, res) => {
  //Obtiene todas las estaciones e islas
  try {
    let response = await ES.findAll({ include: [{ model: Islas }] });
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
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
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
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
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await estacionServiceM.delete(id);
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
