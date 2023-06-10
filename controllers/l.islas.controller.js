import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
const { Islas, Mangueras, Auditoria } = models;
const { verificar } = auth;

const controller = {};
const area = "Islas";

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
      const isla = await Islas.findByPk(el.idisla);
      const gas = await isla.getGas();

      response.push({ ...el.dataValues, gas });
    }

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

      await Auditoria.create({
        peticion: area,
        idempleado: user.token.data.datos.idempleado,
        accion: 2,
        idaffectado: islas.idisla,
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

    const auditoriaC = req.body.map((el) => ({
      peticion: "Manguera",
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: el.idmanguera,
    }));

    await Auditoria.bulkCreate(auditoriaC);

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

    await Auditoria.create({
      peticion: area,
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: idIsla,
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

export default controller;
