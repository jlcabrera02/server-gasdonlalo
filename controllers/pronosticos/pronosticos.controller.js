import Decimal from "decimal.js-light";
import models from "../../models";
import { Op, where } from "sequelize";
import sequelize from "../../config/configdb";
import { obtenerConfiguraciones } from "../../services/configuracionesPersonalizables";
import prediccionCombustible from "../../services/ModeloPredictivoPronostico";

const { Pronosticos, ES, Gas, Pedidos } = models;

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
    const { fechaI, fechaF, limit, order, pronostico } = req.query;
    const filtros = {};
    const combustible = ["magna", "premium", "diesel"];
    const dias = Number(pronostico) || 0;

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

    const lastDate = await Pronosticos.findOne({
      where: { registro: "Real" },
      order: [["fecha", "DESC"]],
    });

    for (const i of estaciones) {
      const dataC = [];
      const idestacion = i.dataValues.idestacion_servicio;
      for (const c of combustible) {
        const res = await Pronosticos.findAll({
          where: {
            ...filtros,
            idestacion_servicio: idestacion,
            combustible: c.charAt(0).toUpperCase(),
          },
          include: [{ model: Gas, as: "gas" }, { model: ES }],
          order: [["fecha", order ? order : "ASC"]],
          limit: Number(limit) || null,
        });
        dataC.push(res);
      }

      response.push({
        idestacion: idestacion,
        magna: dataC[0],
        premium: dataC[1],
        diesel: dataC[2],
      });
    }

    const configuraciones = obtenerConfiguraciones().configPronosticos;

    const funtionR = async (dias = 7) => {
      if (dias === 0) return;
      //Arreglo donde se guardaran los combustibles para saber cuales son los que requeiren reabastecimiento
      const pilaC = [];
      for (const i in estaciones) {
        for (const c of combustible) {
          //Si no se encontro informacion no returnamos nada
          if (response[i][c].length < 1) return;
          const temp = {};
          let peso = 0;
          const prediccion = await prediccionCombustible(response[i][c], dias);
          // response[i][c].unshift(...prediccion.reverse());
          response[i][c].unshift(prediccion[0]);
          temp.combustible = c;
          temp.fecha = prediccion[0].fecha;
          temp.estacion = Number(i) + 1;
          temp.idestacion_servicio = Number(i) + 1;
          temp.promedio_ventas_mes = prediccion[0].promedio_ventas_mes;
          temp.existencia_litros = prediccion[0].existencia_litros;
          temp.ventas_litros = prediccion[0].ventas_litros;
          temp.compra_litros = null;
          temp.registro = "Pronostico";
          temp.peso = peso;

          if (new Date(temp.fecha).getDay() != 6) {
            if (
              new Decimal(configuraciones.tanques[`gdl${Number(i) + 1}`][c])
                .sub(prediccion[0].existencia_litros)
                .toNumber() > 20000
            ) {
              temp.peso += 1;
            }

            if (prediccion[0].existencia_litros < prediccion[0].limite) {
              temp.peso += 2;
            }
          }

          pilaC.push(temp);
        }
      }

      //Ordenamos de mayor a menor los combustibles
      const orderAsc = pilaC
        .filter((el) => el.peso > 0)
        .sort((a, b) => (b.peso > b.peso ? 0 : 1))
        .slice(0, 2);

      for (let i = 0; i < orderAsc.length; i++) {
        const el = orderAsc[i];
        const index = response[Number(el.estacion) - 1][
          el.combustible
        ].findIndex((el) => el.fecha === el.fecha);

        if (orderAsc.length > 1) {
          response[Number(el.estacion) - 1][el.combustible][
            index
          ].compra_litros = 20000;
        } else {
          if (el.combustible === "magna" && el.peso > 2) {
            response[Number(el.estacion) - 1][el.combustible][
              index
            ].compra_litros = 40000;
          }
        }
      }

      if (dias > 1) {
        await funtionR(dias - 1);
      }
    };

    await funtionR(dias);

    res.status(200).json({
      success: true,
      response,
      configuraciones,
      ultimaFechaReal: lastDate.dataValues.fecha,
    });
  } catch (err) {
    console.log(err);
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

async function guardarPedidos(req, res) {
  try {
    const cuerpo = req.body;

    const cuerpoParse = cuerpo.map((el) => ({
      idestacion_servicio: el.idestacion,
      combustible: el.combustible,
      fecha: el.fecha,
      cantidad: el.cantidad,
    }));

    const response = await Pedidos.bulkCreate(cuerpoParse);

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al ingresar la información",
    });
  }
}

async function obtenerPedidos(req, res) {
  try {
    const { month, year } = req.query;
    const filtros = {};

    if (month && year) {
      filtros[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    const response = await Pedidos.findAll({
      where: filtros,
      order: [["fecha", "DESC"]],
      include: [{ model: Gas, as: "gas" }],
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

async function editarPedidos(req, res) {
  try {
    const { idpedidos } = req.params;
    const { nLemargo, nConductor, fechaDescarga } = req.body;

    const response = await Pedidos.update(
      {
        n_lemargo: nLemargo,
        n_conductor: nConductor,
        fecha_descarga: fechaDescarga,
      },
      { where: { idpedidos } }
    );

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al ingresar la información",
    });
  }
}

async function eliminarPedidos(req, res) {
  try {
    const { idpedidos } = req.params;

    const response = await Pedidos.destroy({ where: { idpedidos } });

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al eliminar el pedido",
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
  guardarPedidos,
  obtenerPedidos,
  editarPedidos,
  eliminarPedidos,
};
