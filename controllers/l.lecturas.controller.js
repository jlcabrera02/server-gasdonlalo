import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
const { InfoLecturas, LecturasFinales, Islas, Mangueras, Liquidaciones } =
  models;
const { verificar } = auth;
const controller = {};

controller.lecturasIniciales = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;

    Mangueras.belongsTo(Islas, { foreignKey: "idisla" });
    Islas.hasMany(Mangueras, { foreignKey: "idisla" });

    const response = await Mangueras.findAll({
      include: [
        {
          model: InfoLecturas,
          include: [{ model: Liquidaciones, where: { cancelado: null } }],
        },
        {
          model: Islas,
          where: { idestacion_servicio: idEstacion },
        },
      ],
      order: [[InfoLecturas, "idinfo_lectura", "DESC"]],
    });

    const buscar = response.find(
      (el) => el.dataValues.info_lecturas.length > 0
    );

    const folio = buscar
      ? buscar.dataValues.info_lecturas[0].dataValues.idinfo_lectura
      : null;

    res.status(200).json({ success: true, response, folio });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateLecturaInicial = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { data, folio } = req.body;

    let response;

    if (!folio) {
      response = await sequelize.transaction(async (t) => {
        const infoLect = await InfoLecturas.create(
          {
            fecha: new Date(),
            idliquidacion: 0,
          },
          { transaction: t }
        );

        const cuerpo = data.map((el) => ({
          idmanguera: el.idmanguera,
          idinfo_lectura: infoLect.idinfo_lectura,
          lecturai: 0,
          lecturaf: el.lectura,
          precio: 0,
          importe: "0",
        }));

        const lecturasFinales = await LecturasFinales.bulkCreate(cuerpo, {
          transaction: t,
        });

        return { infoLect, lecturasFinales };
      });
    } else {
      const cuerpo = data.map((el) => ({
        idmanguera: el.idmanguera,
        idinfo_lectura: folio,
        lecturai: 0,
        lecturaf: el.lectura,
        precio: 0,
        importe: "0",
      }));

      response = await LecturasFinales.bulkCreate(cuerpo, {
        updateOnDuplicate: ["lecturaf"],
      });
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
