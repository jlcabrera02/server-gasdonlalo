import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../../services/configuracionesPersonalizables";
const controller = {};

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

export default controller;
