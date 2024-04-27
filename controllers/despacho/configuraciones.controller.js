import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../../services/configuracionesPersonalizables";
import model from "../../models";
const controller = {};
const { PM } = model;

controller.getConfig = async (req, res) => {
  try {
    const configuraciones = obtenerConfiguraciones().configDespacho;

    return res.status(200).json({ success: true, response: configuraciones });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.setConfig = async (req, res) => {
  try {
    const { key, value } = req.body;
    const configuraciones = obtenerConfiguraciones().configDespacho;
    escribirConfiguraciones({
      configDespacho: {
        ...configuraciones,
        [key]: { ...configuraciones[key], puntajeMinimo: value },
      },
    });

    return res.status(200).json({ success: true, response: configuraciones });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.getPM = async (req, res) => {
  try {
    const response = await PM.findAll({
      order: [
        ["fecha", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    return res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.createPM = async (req, res) => {
  try {
    const { evaluacion, cantidad, fecha } = req.body;
    const response = await PM.create({ evaluacion, cantidad, fecha });

    return res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.deletePM = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await PM.destroy({ where: { idpuntajes_minimo: id } });

    return res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

export default controller;
