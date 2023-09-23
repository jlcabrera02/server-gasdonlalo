import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
import { Op, Sequelize } from "sequelize";
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
  CodigosUso,
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
  idTurno,
  idIsla,
  combustible,
  posicion,
  idEmpleado,
  orderLiquidaciones,
  filtro,
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
    querysHorario.fechaturno = { [Op.between]: [fechaI, fechaF] };
  }

  const querys = {};
  if (filtro) {
    switch (filtro) {
      case "capturado":
        querys.cancelado = { [Op.is]: null };
        querys.lecturas = { [Op.not]: null };
        querys.capturado = true;
        break;
      case "capturando":
        querys.lecturas = { [Op.is]: null };
        querys.capturado = true;
        break;
      case "por capturar":
        querys.lecturas = null;
        querys.capturado = false;
        break;
      case "cancelado":
        querys.cancelado = { [Op.not]: null };
        break;
      case "reporte":
        querys.capturado = true;
        querys.lecturas = { [Op.not]: null };
        break;

      default:
        break;
    }
  }
  if (idEmpleado) querysHorario.idempleado = idEmpleado;
  if (idTurno) querysHorario.idturno = idTurno;
  // if (cancelado) querys.cancelado = cancelado;
  // if (cancelado === "false") querys.cancelado = { [Op.is]: null };
  if (estacionS) querysHorario.idestacion_servicio = estacionS;

  let response = await Liquidaciones.findAll({
    where: { ...querys },
    include: [
      { model: empleados, as: "empleado_captura" },
      {
        model: Horarios,
        include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        where: querysHorario,
      },
      { model: Vales, include: { model: CodigosUso } },
      { model: Efectivo, include: { model: CodigosUso } },
    ],
    order: [["idliquidacion", orderLiquidaciones === "DESC" ? "DESC" : "ASC"]],
  });

  if (idIsla) {
    const multiple = Array.isArray(idIsla);
    response = filtrarDatos(
      response,
      multiple ? idIsla.map((id) => Number(id)) : [Number(idIsla)],
      "idisla"
    );
  }

  if (combustible) {
    const multiple = Array.isArray(combustible);
    response = filtrarDatos(
      response,
      multiple ? [...combustible] : [combustible],
      "idgas"
    );
  }
  if (posicion) {
    const multiple = Array.isArray(posicion);
    response = filtrarDatos(
      response,
      multiple ? posicion.map((p) => Number(p)) : [Number(posicion)],
      "posicion"
    );
  }

  return response;
};

//Me sirve para poder filtrar combustible, islas y posiciones
const filtrarDatos = (datos, filtros, propiedad) => {
  const data = JSON.parse(JSON.stringify(datos));
  const newData = [];
  data.forEach((liq) => {
    const tempLect = [];
    const lecturas = JSON.parse(liq.lecturas);
    lecturas.forEach((lect) => {
      const test = filtros.includes(lect[propiedad]);
      if (test) {
        tempLect.push(lect);
      }
    });
    newData.push({ ...liq, lecturas: JSON.stringify(tempLect) });
  });
  return newData;
};

export default controller;
