import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../services/configuracionesPersonalizables";

const controller = {};

controller.configurarPorcentajesAceitoso = async (req, res) => {
  try {
    const { key, value } = req.body;
    const configuraciones = obtenerConfiguraciones().configRH;
    escribirConfiguraciones({
      configRH: {
        ...configuraciones,
        concursoAceitoso: {
          porcentajes: {
            ...configuraciones.concursoAceitoso.porcentajes,
            [key]: Number(value),
          },
        },
      },
    });
    res.status(200).json({ success: true, response: "ok" });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.configurarEfectivoOctanoso = async (req, res) => {
  try {
    const { key, value } = req.body;
    const configuraciones = obtenerConfiguraciones().configRH;
    escribirConfiguraciones({
      configRH: {
        ...configuraciones,
        concursoOctanoso: {
          efectivo: {
            ...configuraciones.concursoOctanoso.efectivo,
            [key]: Number(value),
          },
        },
      },
    });
    res.status(200).json({ success: true, response: "ok" });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerConfigRH = async (req, res) => {
  try {
    const configuraciones = obtenerConfiguraciones().configRH;

    res.status(200).json({ success: true, response: configuraciones });
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
