import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
import { Op } from "sequelize";
const {
  InfoLecturas,
  LecturasFinales,
  Islas,
  Mangueras,
  Liquidaciones,
  Horarios,
  empleados,
  Turnos,
  ES,
  Vales,
  Efectivo,
  Auditoria,
  Gas,
} = models;
const { verificar } = auth;
const controller = {};

controller.lecturasIniciales = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    const { auth } = req.query;
    if (!user.success && !auth) throw user;
    const { idEstacion } = req.params;

    Mangueras.belongsTo(Islas, { foreignKey: "idisla" });
    Islas.hasMany(Mangueras, { foreignKey: "idisla" });

    Mangueras.belongsTo(Gas, { foreignKey: "idgas" });
    Gas.hasMany(Mangueras, { foreignKey: "idgas" });

    const response = await Mangueras.findAll({
      include: [
        { model: Gas },
        {
          model: InfoLecturas,
          where: { cancelado: false, idestacion_servicio: idEstacion },
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

controller.buscarLecturas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;
    const { folio } = req.query;

    Mangueras.belongsTo(Islas, { foreignKey: "idisla" });
    Islas.hasMany(Mangueras, { foreignKey: "idisla" });

    const response = await Mangueras.findAll({
      include: [
        {
          model: InfoLecturas,
          where: {
            cancelado: false,
            idestacion_servicio: idEstacion,
            idinfo_lectura: { [Op.lte]: folio },
          },
        },
        {
          model: Islas,
          where: { idestacion_servicio: idEstacion },
        },
      ],
      order: [[InfoLecturas, "idinfo_lectura", "DESC"]],
    });

    res.status(200).json({ success: true, response });
  } catch (error) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.buscarInfoLec = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;
    const { cancelado } = req.query;

    LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
    InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

    const querys = {
      idestacion_servicio: idEstacion,
    };

    if (cancelado) querys.cancelado = cancelado;

    const response = await InfoLecturas.findAll({
      where: querys,
      include: LecturasFinales,
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

controller.buscarInfoLecLimit = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;
    const { num } = req.query;
    const limit = Number(num);

    const response = await InfoLecturas.findAll({
      // attributes: ["idinfo_lectura", "idliquidacion"],
      where: { idestacion_servicio: idEstacion, cancelado: false },
      order: [["idinfo_lectura", "DESC"]],
      include: [
        {
          model: Liquidaciones,
          include: [{ model: Horarios, include: empleados }],
        },
      ],
      limit: [limit, 2],
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

controller.buscarLecturasXIdEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await buscarLecturasXIdEmpleado({
      ...req.body,
      cancelado: false,
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

controller.jsonExcel = async (req, res) => {
  try {
    const response = await buscarLecturasXIdEmpleado(req.query);

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

controller.updateLecturaInicial = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { data, folio, idestacionServicio } = req.body;

    let response;

    if (!folio) {
      response = await sequelize.transaction(async (t) => {
        const infoLect = await InfoLecturas.create(
          {
            fecha: new Date(),
            idliquidacion: 0,
            idestacion_servicio: idestacionServicio,
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

        const auditoriaC = data.map((el) => ({
          peticion: "Lectura Inicial",
          idempleado: user.token.data.datos.idempleado,
          accion: 2,
          idaffectado: el.idmanguera,
        }));

        await Auditoria.bulkCreate(auditoriaC, { transaction: t });

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

    const auditoriaC = data.map((el) => ({
      peticion: "Lectura Inicial",
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: ` ${el.idmanguera} folio_${folio}`,
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

export const buscarLecturasXIdEmpleado = async ({
  idEmpleado,
  cancelado,
  estacionS,
  fechaI,
  fechaF,
}) => {
  LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
  InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

  LecturasFinales.belongsTo(Mangueras, { foreignKey: "idmanguera" });
  Mangueras.hasMany(LecturasFinales, { foreignKey: "idmanguera" });

  Mangueras.belongsTo(Islas, { foreignKey: "idisla" });
  Islas.hasMany(Mangueras, { foreignKey: "idisla" });

  Gas.hasMany(Mangueras, { foreignKey: "idgas" });
  Mangueras.belongsTo(Gas, { foreignKey: "idgas" });
  const querysHorario = {};

  if (fechaI && fechaF) {
    querysHorario.fechaliquidacion = { [Op.between]: [fechaI, fechaF] };
  }

  const querys = { capturado: true, lecturas: { [Op.not]: null } };
  //Checar si no hay problemas con el historial o el de ventas
  if (idEmpleado) querysHorario.idempleado = idEmpleado;
  if (cancelado) querys.cancelado = cancelado;
  if (cancelado === "false") querys.cancelado = { [Op.is]: null };
  if (estacionS) querysHorario.idestacion_servicio = estacionS;

  const response = await Liquidaciones.findAll({
    where: querys,
    include: [
      {
        model: Horarios,
        include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        where: querysHorario,
      },
      {
        model: InfoLecturas,
        include: [
          {
            model: LecturasFinales,
            include: [
              {
                model: Mangueras,
                include: [{ model: Islas, include: ES }, { model: Gas }],
              },
            ],
          },
        ],
      },
      { model: Vales },
      { model: Efectivo },
    ],
  });

  return response;
};

export default controller;
