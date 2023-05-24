import islaM from "../models/l.islas.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
const { Islas, Mangueras } = models;
const { verificar } = auth;

const controller = {};

controller.findIslas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;
    const response = [];

    const islas = await Islas.findAll({
      where: { idestacion_servicio: idEstacion },
    });
    for (let i = 0; i < islas.length; i++) {
      const el = islas[i];
      // const mangueras = await islaM.findManguerasByIsla(el.idisla);
      // islas[i].positionL = mangueras.filter((el) => el.direccion === "iz");
      // islas[i].positionR = mangueras.filter((el) => el.direccion === "dr");
      const isla = await Islas.findByPk(el.idisla);
      const gas = await isla.getGas();

      response.push({ ...el.dataValues, gas });
    }

    // const gasolinas = [];
    // for (let i = 0; i < islas.length; i++) {}

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
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

    const response = await sequelize.transaction(async (t) => {
      const islas = await Islas.create(
        {
          nisla: numeroIsla,
          idestacion_servicio: idEstacion,
        },
        { transaction: t }
      );

      const DM = [
        [islas.idisla, "M", 0, 1, `M${islas.idisla * 2 - 1}`],
        [islas.idisla, "M", 0, 2, `M${islas.idisla * 2}`],
        [islas.idisla, "P", 0, 1, `P${islas.idisla * 2 - 1}`],
        [islas.idisla, "P", 0, 2, `P${islas.idisla * 2}`],
        [islas.idisla, "D", 0, 1, `D${islas.idisla * 2 - 1}`],
        [islas.idisla, "D", 0, 2, `D${islas.idisla * 2}`],
      ];

      const cuerpoManguera = DM.map((el) => ({
        idisla: el[0],
        idgas: el[1],
        tiene: el[2],
        direccion: el[3],
        idmanguera: el[4],
      }));

      const mangueras = await Mangueras.bulkCreate(cuerpoManguera, {
        transaction: t,
      });

      return { mangueras, islas };
    });

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

controller.updateMangueras = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const cuerpo = req.body.map((el) => ({
      idmanguera: el.idmanguera,
      tiene: el.tiene,
      idisla: 0,
      idgas: 0,
      direccion: "iz",
    }));

    const response = await Mangueras.bulkCreate(cuerpo, {
      updateOnDuplicate: ["tiene"],
    });

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

controller.updateIsla = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const { idIsla } = req.params;
    const { numeroIsla, idEstacionServicio, habilitada } = req.body;

    const cuerpo = {
      nisla: numeroIsla,
      idestacion_servicio: idEstacionServicio,
      habilitada,
    };

    const response = await Islas.update(cuerpo, { where: { idisla: idIsla } });

    /* for (let i = 0; i < cuerpo.length; i++) {
      await guardarBitacora([
        "Modificar Isla",
        user.token.data.datos.idempleado,
        3,
        idIsla,
      ]);
    } */

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
