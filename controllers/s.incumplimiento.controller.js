import incumplimientoM from "../models/s.incumplimiento.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await incumplimientoM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.findIncumplimientosXcategorizacion = async (req, res) => {
  try {
    const { idCategorizacion } = req.params;
    let response = await incumplimientoM.findIncumplimientosXcategorizacion(
      idCategorizacion
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
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
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.categorizarSNC = async (req, res) => {
  try {
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.categorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.descategorizarSNC = async (req, res) => {
  try {
    console.log("eols");
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.descategorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
controller.categorizarSNC = async (req, res) => {
  try {
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.categorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
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
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await incumplimientoM.delete(id);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

export default controller;
