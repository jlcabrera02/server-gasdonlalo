import Decimal from "decimal.js-light";
import models from "../../models";
import { Op } from "sequelize";
import sequelize from "../../config/configdb";
import { obtenerConfiguraciones } from "../../services/configuracionesPersonalizables";
const { Pronosticos, ES, Gas } = models;

async function obtenerPronosticosXcombustible(req, res) {
  try {
    const { idEstacion, fechaI, fechaF } = req.query;
    const filtros = {};

    if (idEstacion) filtros.idestacion_servicio = idEstacion;
    if (fechaI && fechaF) {
    }

    const magna = await Pronosticos.findAll({
      where: { ...filtros, combustible: "M" },
      include: [{ model: Gas, as: "gas" }, { model: ES }],
      order: [["fecha", "ASC"]],
    });
    const premium = await Pronosticos.findAll({
      where: { ...filtros, combustible: "P" },
      include: [{ model: Gas, as: "gas" }, { model: ES }],
      order: [["fecha", "ASC"]],
    });
    const diesel = await Pronosticos.findAll({
      where: { ...filtros, combustible: "D" },
      include: [{ model: Gas, as: "gas" }, { model: ES }],
      order: [["fecha", "ASC"]],
    });
    res
      .status(200)
      .json({ success: true, response: [{ magna, premium, diesel }] });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

async function obtenerPronosticosXES(req, res) {
  try {
    const { fechaI, fechaF, limit, order } = req.query;
    const filtros = {};

    if (fechaI && fechaF) {
      filtros.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    const estaciones = await ES.findAll({});
    const response = [];

    if (estaciones.length < 1) {
      throw {
        success: false,
        code: 404,
        msg: "Error al obtener las estaciones de servicio",
      };
    }

    for (const i of estaciones) {
      const idestacion = i.dataValues.idestacion_servicio;
      const magna = await Pronosticos.findAll({
        where: {
          ...filtros,
          idestacion_servicio: idestacion,
          combustible: "M",
        },
        include: [{ model: Gas, as: "gas" }, { model: ES }],
        order: [["fecha", order ? order : "ASC"]],
        limit: Number(limit) || null,
      });
      const premium = await Pronosticos.findAll({
        where: {
          ...filtros,
          idestacion_servicio: idestacion,
          combustible: "P",
        },
        include: [{ model: Gas, as: "gas" }, { model: ES }],
        order: [["fecha", order ? order : "ASC"]],
        limit: Number(limit) || null,
      });
      const diesel = await Pronosticos.findAll({
        where: {
          ...filtros,
          idestacion_servicio: idestacion,
          combustible: "D",
        },
        include: [{ model: Gas, as: "gas" }, { model: ES }],
        order: [["fecha", order ? order : "ASC"]],
        limit: Number(limit) || null,
      });

      response.push({ idestacion: idestacion, magna, premium, diesel });
    }

    const configuraciones = obtenerConfiguraciones().configPronosticos;

    res.status(200).json({ success: true, response, configuraciones });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

async function guardarPronostico(req, res) {
  try {
    const cuerpo = [];
    const { estacion1, estacion2, fecha, registro } = req.body;
    const keysEs1 = Object.keys(estacion1);
    const keysEs2 = Object.keys(estacion2);

    //Informacion para la GDL1
    for (const element of keysEs1) {
      const {
        existencia_litros,
        compra_litros,
        ventas_litros,
        limite,
        promedio_ventas_mes,
      } = estacion1[element];

      cuerpo.push({
        combustible: element.charAt().toUpperCase(),
        existencia_litros,
        compra_litros,
        ventas_litros,
        limite,
        fecha,
        registro,
        idestacion_servicio: 1,
        promedio_ventas_mes,
      });
    }

    //Informacion para la GDL2
    for (const element of keysEs2) {
      const {
        existencia_litros,
        compra_litros,
        ventas_litros,
        limite,
        promedio_ventas_mes,
      } = estacion2[element];

      cuerpo.push({
        combustible: element.charAt().toUpperCase(),
        existencia_litros,
        compra_litros,
        ventas_litros,
        limite,
        fecha,
        registro,
        idestacion_servicio: 2,
        promedio_ventas_mes,
      });
    }

    const response = await sequelize.transaction(async (t) => {
      const data = await Pronosticos.findAll({
        where: { fecha },
        transaction: t,
      });

      if (data.length > 0) {
        throw { code: 400, msg: "Ya existen valores", success: false };
      }

      const guardarPronostico = await Pronosticos.bulkCreate(cuerpo, {
        transaction: t,
      });

      return guardarPronostico;
    });

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al ingresar la información",
    });
  }
}

async function pruebas(req, res) {
  try {
    const data = await Pronosticos.findAll({ where: { fecha: "2024-04-15" } });
    const prioridades = {
      combustible: { M: 3, P: 2, D: 1 },
      estaciones: { 1: 2, 2: 1 },
      capacidad: [
        //Capacidad si hay para 2000 L asignar 1, si hay para  4000L asignar 2, si hay para 6000, asignar 3
        { estacion: 1, magna: 70000, premium: 30000, disiel: 30000 },
        { estacion: 2, magna: 40000, premium: 40000, disiel: 40000 },
      ],
      limite: [
        //Ordenar la capacidad
        { estacion: 1, magna: 46000, premium: 10000, disiel: 10000 },
        { estacion: 2, magna: 20000, premium: 20000, disiel: 20000 },
      ],
    };

    const ordenarXMayorFaltante = data.sort(
      (a, b) =>
        new Decimal(a.dataValues.limite)
          .sub(a.dataValues.existencia_litros)
          .toNumber() -
        new Decimal(b.dataValues.limite)
          .sub(b.dataValues.existencia_litros)
          .toNumber()
    );

    for (const index in ordenarXMayorFaltante) {
      const element = ordenarXMayorFaltante[index].dataValues;
      const {
        combustible,
        idestacion_servicio,
        limite,
        existencia_litros,
        ventas_litros,
      } = element;
      const diferencia = new Decimal(limite).sub(existencia_litros).toNumber();
      let peso = 0;
      peso += prioridades.combustible[combustible];
      // peso += prioridades.estaciones[idestacion_servicio];
      if (Number(existencia_litros) <= Number(limite)) peso += 3;
      if (Number(existencia_litros) * 2 <= Number(ventas_litros)) peso += 3;
      element.diferencia = diferencia;

      if (diferencia > 1) {
        peso += Number(index);
      }

      element.peso = peso;
    }

    const ordenar = data.sort((a, b) => b.dataValues.peso - a.dataValues.peso);

    res.status(200).json({ success: true, response: ordenar });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

export default {
  obtenerPronosticosXcombustible,
  obtenerPronosticosXES,
  pruebas,
  guardarPronostico,
};
