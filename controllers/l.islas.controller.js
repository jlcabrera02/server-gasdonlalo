import islaM from "../models/l.islas.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};

controller.findIslas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;

    const islas = await islaM.findIslas(idEstacion);
    for (let i = 0; i < islas.length; i++) {
      const el = islas[i];
      const mangueras = await islaM.findManguerasByIsla(el.idisla);
      islas[i].positionL = mangueras.filter((el) => el.direccion === "iz");
      islas[i].positionR = mangueras.filter((el) => el.direccion === "dr");
    }
    // const gasolinas = [];
    // for (let i = 0; i < islas.length; i++) {}

    res.status(200).json({ success: true, response: islas });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertIslas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { numeroIsla, idEstacion } = req.body;

    const insertIsla = await islaM.insertIsla(numeroIsla, idEstacion);
    const dataMangueras = [
      [insertIsla.insertId, "M", 0, 1, `M${insertIsla.insertId * 2 - 1}`],
      [insertIsla.insertId, "M", 0, 2, `M${insertIsla.insertId * 2}`],
      [insertIsla.insertId, "P", 0, 1, `P${insertIsla.insertId * 2 - 1}`],
      [insertIsla.insertId, "P", 0, 2, `P${insertIsla.insertId * 2}`],
      [insertIsla.insertId, "D", 0, 1, `D${insertIsla.insertId * 2 - 1}`],
      [insertIsla.insertId, "D", 0, 2, `D${insertIsla.insertId * 2}`],
    ];
    await islaM.insertManguera(dataMangueras);

    await guardarBitacora([
      "Insertar nueva isla",
      user.token.data.datos.idempleado,
      2,
      insertIsla.insertId,
    ]);

    res.status(200).json({ success: true, response: insertIsla });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateMangueras = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const cuerpo = req.body.map((el) => [el.tiene, el.idmanguera]);

    const response = await islaM.updateMangueras(cuerpo);

    for (let i = 0; i < cuerpo.length; i++) {
      await guardarBitacora([
        "Modificar Estacion",
        user.token.data.datos.idempleado,
        3,
        `gas: ${cuerpo[i][1]} idisla: ${cuerpo[i][2]}`,
      ]);
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateIsla = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const { idIsla } = req.params;
    const { numeroIsla, idEstacionServicio, habilitada } = req.body;

    const cuerpo = [
      {
        nisla: numeroIsla,
        idestacion_servicio: idEstacionServicio,
        habilitada,
      },
      idIsla,
    ];

    const response = await islaM.updateIsla(cuerpo);

    for (let i = 0; i < cuerpo.length; i++) {
      await guardarBitacora([
        "Modificar Isla",
        user.token.data.datos.idempleado,
        3,
        idIsla,
      ]);
    }

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
