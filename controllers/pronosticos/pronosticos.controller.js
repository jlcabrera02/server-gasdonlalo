import Decimal from "decimal.js-light";
import models from "../../models";
import { Op } from "sequelize";
import sequelize from "../../config/configdb";
import {
  escribirConfiguraciones,
  obtenerConfiguraciones,
} from "../../services/configuracionesPersonalizables";
import prediccionCombustible from "../../services/ModeloPredictivoPronostico";
import formatTiempo from "../../assets/formatTiempo";
import agruparArr from "../../assets/agruparArr";
import calcularTotal from "../../assets/sumarAlgo";
import * as dfn from "danfojs";

const { Pronosticos, ES, Gas, Pedidos } = models;

async function obtenerReportesPedidos(req, res) {
  try {
    const { fechaI, fechaF, month, year, idEs } = req.query;
    const filtros = {};

    if (fechaI && fechaF) {
      filtros.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    if (idEs) {
      filtros.idestacion_servicio = idEs;
    }

    filtros.compra_litros = { [Op.not]: null };

    if (month && year) {
      filtros[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    const response = await Pronosticos.findAll({
      where: filtros,
    });

    const dataDf = () => {
      if (response.length > 0) {
        const df = new dfn.DataFrame(JSON.parse(JSON.stringify(response)))
          .replace("M", "Magna", {
            columns: ["combustible"],
          })
          .replace("D", "Diesel", {
            columns: ["combustible"],
          })
          .replace("P", "Premium", {
            columns: ["combustible"],
          })
          .asType("compra_litros", "float32");

        const grpDescargas = df.groupby(["combustible", "idestacion_servicio"]);
        const count = grpDescargas.agg({ compra_litros: ["sum", "count"] });

        const formater = dfn.toJSON(count);
        return formater;
      }
      return [];
    };

    res.status(200).json({
      success: true,
      response: dataDf(),
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

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
    const now = new Date();
    const configPronostico = obtenerConfiguraciones().configPronosticos;
    const { fechaI, fechaF, limit, order, pronostico, evitarC } = req.query;
    const filtros = {};
    const combustible = ["magna", "premium", "diesel"];
    const dias = Number(pronostico) || 0;

    if (fechaI && fechaF) {
      filtros.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    const estaciones = await ES.findAll({ limit: 2 });
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

    const monthCurrent = await Pronosticos.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("fecha")),
            now.getMonth() === 0 ? 12 : now.getMonth()
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("fecha")),
            now.getMonth() === 0
              ? Number(now.getFullYear()) - 1
              : now.getFullYear()
          ),
        ],
      },
    });

    const promedioVentas = {};
    const groupCombustible = agruparArr(
      JSON.parse(JSON.stringify(monthCurrent)),
      (el) => el.combustible
    ).values();

    for (const el of groupCombustible) {
      const es1 = el.filter((es) => es.idestacion_servicio === 1);
      const es2 = el.filter((es) => es.idestacion_servicio === 2);

      const suma1 = calcularTotal(
        es1.map((d) => (!d.ventas_litros ? 0 : d.ventas_litros))
      );
      const suma2 = calcularTotal(
        es2.map((d) => (!d.ventas_litros ? 0 : d.ventas_litros))
      );

      const prom1 = new Decimal(suma1).div(es1.length).toNumber();
      const prom2 = new Decimal(suma2).div(es2.length).toNumber();

      promedioVentas[`${el[0].combustible}-1`] = Math.round(prom1);
      promedioVentas[`${el[0].combustible}-2`] = Math.round(prom2);
    }

    const pedidos = JSON.parse(
      JSON.stringify(
        await Pedidos.findAll({
          where: { fecha: { [Op.gt]: lastDate.dataValues.fecha } },
          order: [["fecha", "ASC"]],
        })
      )
    );

    const ultimaFechaPedido =
      pedidos.length > 0 ? new Date(pedidos[pedidos.length - 1].fecha) : null;

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
        //Fragmento de codigo para ver pedidos antes de la fecha de pronostico
        res.forEach((el) => {
          el.dataValues.isPedido = false;
          const existPedido = pedidos.find(
            (p) =>
              p.fecha === el.dataValues.fecha &&
              p.combustible === el.dataValues.combustible &&
              p.idestacion_servicio === el.dataValues.idestacion_servicio
          );
          if (existPedido) {
            if (!existPedido.fecha_descarga) {
              el.dataValues.isPedido = true;
              el.dataValues.compra_litros = existPedido.cantidad;
            }
          }
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

    const funtionR = async (dias = 7, evitarCompras = false) => {
      if (dias === 0) return;
      //Arreglo donde se guardaran los combustibles para saber cuales son los que requeiren reabastecimiento
      const pilaC = [];
      for (const i in estaciones) {
        for (const c of combustible) {
          //Si no se encontro informacion no returnamos nada
          if (response[i][c].length < 1) return;
          if (!response[i][c][0].ventas_litros) {
            // response[i][c][0].ventas_litros = 100;
            response[i][c][0].ventas_litros =
              configPronostico.ventas_promedio[`gdl${Number(i) + 1}`][
                c.charAt().toLocaleUpperCase()
              ];
            // console.log(`gdl${Number(i) + 1}`);
          }
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
              // if (prediccion[0].combustible === "M") {
              //   temp.peso += 2;
              // }
              if (prediccion[0].existencia_litros < prediccion[0].limite) {
                temp.peso += 2;
              }
            }
          }

          pilaC.push(temp);
        }
      }

      if (!evitarCompras) {
        for (let i = 0; i < pedidos.length; i++) {
          const p = pedidos[i];
          const combustible =
            p.combustible === "M"
              ? "magna"
              : p.combustible === "P"
              ? "premium"
              : "diesel";
          const index = response[Number(p.idestacion_servicio) - 1][
            combustible
          ].findIndex((el) => el.fecha === p.fecha);

          if (index >= 0) {
            let elemento =
              response[Number(p.idestacion_servicio) - 1][combustible][index];
            elemento.compra_litros = p.cantidad;
            if (!p.fecha_descarga) {
              elemento.isPedido = true;
            }
          }
        }

        //Ordenamos de mayor a menor los combustibles
        const orderAsc = pilaC
          .filter((el) => el.peso > 0)
          .sort((a, b) => (b.peso > b.peso ? 0 : 1));
        // .slice(0, 2);

        for (let i = 0; i < orderAsc.length; i++) {
          const el = orderAsc[i];
          const index = response[Number(el.estacion) - 1][
            el.combustible
          ].findIndex((el) => el.fecha === el.fecha);

          if (ultimaFechaPedido && new Date(el.fecha) <= ultimaFechaPedido) {
            break;
          }

          if (orderAsc.length >= 1) {
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
      }

      if (dias > 1) {
        await funtionR(dias - 1, evitarCompras);
      }
    };

    await funtionR(dias, evitarC);

    res.status(200).json({
      success: true,
      response,
      configuraciones,
      ultimaFechaReal: lastDate.dataValues.fecha,
      promedioVentas,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

async function antesEigualDe(req, res) {
  //Exclusivo para obtener un registro para la parte de crear registro de pronosticos menu pronosticos
  try {
    const { fecha } = req.query;
    const estaciones = await ES.findAll({ limit: 2 });
    const combustible = ["magna", "premium", "diesel"];
    const filtros = { fecha: { [Op.lte]: fecha } };
    const response = [];

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
          order: [["fecha", "DESC"]],
          limit: 2,
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

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al ingresar la información",
    });
  }
}

async function guardarPronostico(req, res) {
  try {
    const cuerpo = [];
    const { estacion1, estacion2, fecha, registro } = req.body;
    const keysEs1 = Object.keys(estacion1);
    const keysEs2 = Object.keys(estacion2);
    const fechaAnterior = formatTiempo.tiempoDB(
      new Date(fecha).setDate(new Date(fecha).getDate() - 1)
    );

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

      const configPronostico = obtenerConfiguraciones().configPronosticos;

      for (const element of cuerpo) {
        const findElemento = await Pronosticos.findOne({
          where: {
            fecha: fechaAnterior,
            combustible: element.combustible,
            idestacion_servicio: element.idestacion_servicio,
          },
          transaction: t,
        });

        await Pronosticos.update(
          { ventas_litros: element.ventas_litros },
          {
            where: { idpronostico: findElemento.dataValues.idpronostico },
            transaction: t,
          }
        );
      }

      cuerpo.forEach((el) => {
        const limite =
          configPronostico.limite[`gdl${el.idestacion_servicio}`][
            el.combustible
          ];
        const ventaP =
          configPronostico.ventas_promedio[`gdl${el.idestacion_servicio}`][
            el.combustible
          ];
        el.limite = limite;
        el.promedio_ventas_mes = ventaP;
        el.ventas_litros = null;
        if (!el.compra_litros) el.compra_litros = null;
      });

      const guardarPronostico = await Pronosticos.bulkCreate(cuerpo, {
        transaction: t,
      });

      return guardarPronostico;
    });

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

async function editarPronostico(req, res) {
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
        idpronostico,
        idpronosticoAnterior,
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
        idpronostico,
        idpronosticoAnterior,
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
        idpronostico,
        idpronosticoAnterior,
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
        idpronostico,
        idpronosticoAnterior,
      });
    }

    const response = await sequelize.transaction(async (t) => {
      const dataUpdate = [];
      cuerpo.forEach((el) => {
        dataUpdate.push({
          idpronostico: el.idpronostico,
          data: {
            compra_litros: el.compra_litros || null,
            existencia_litros: el.existencia_litros,
          },
        });
        dataUpdate.push({
          idpronostico: el.idpronosticoAnterior,
          data: {
            ventas_litros: el.ventas_litros,
          },
        });
      });

      for (const element of dataUpdate) {
        await Pronosticos.update(
          { ...element.data },
          { where: { idpronostico: element.idpronostico }, transaction: t }
        );
      }

      return dataUpdate;
    });

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

async function editarPedidos(req, res) {
  try {
    const { idpedidos } = req.params;
    const { fecha_descarga, cantidad, combustible, idestacion_servicio } =
      req.body;

    const buscarRegistro = await Pronosticos.findOne({
      where: {
        registro: "Real",
        combustible,
        fecha: fecha_descarga,
        idestacion_servicio,
      },
    });

    if (!buscarRegistro) {
      throw {
        code: 400,
        success: false,
        msg:
          "No se encontro un registro para almacenar la carga real, porfavor guarde las existencias y ventas del día " +
          fecha_descarga,
      };
    }

    const response = await sequelize.transaction(async (t) => {
      const pedidoAnterior = await Pedidos.findOne({
        where: { idpedidos: idpedidos },
        transaction: t,
      });

      if (pedidoAnterior) {
        if (pedidoAnterior.dataValues.fecha_descarga !== fecha_descarga) {
          //Si la fecha anterior comparada con la fecha actual es diferente entonces el usuario se equivoco de fecha por lo tanto hay que eliminar el registro de compra de litros proveniente de la tabla pronosticos.
          Pronosticos.update(
            { compra_litros: null },
            {
              where: {
                combustible,
                fecha: pedidoAnterior.dataValues.fecha_descarga,
                idestacion_servicio,
                registro: "Real",
              },
              transaction: t,
            }
          );
        }
      }

      await Pronosticos.update(
        { compra_litros: cantidad },
        {
          where: { idpronostico: buscarRegistro.dataValues.idpronostico },
          transaction: t,
        }
      );
      const response = await Pedidos.update(
        { fecha_descarga, litros_descarga: cantidad },
        { where: { idpedidos }, transaction: t }
      );
      return response;
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al ingresar la información",
    });
  }
}

async function editarInformacionPedidos(req, res) {
  try {
    const { idpedidos } = req.params;
    const { fecha, cantidad, combustible, idestacion_servicio } = req.body;

    const response = await Pedidos.update(
      { fecha, cantidad, idestacion_servicio, combustible },
      { where: { idpedidos } }
    );

    res.status(200).json({ success: true, response });
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
    const { month, year, fecha } = req.query;
    const filtros = {};

    if (month && year) {
      filtros[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    if (fecha) {
      filtros.fecha = fecha;
    }

    const response = await Pedidos.findAll({
      where: filtros,
      order: [["fecha", "ASC"]],
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

async function notificarPedidos(req, res) {
  try {
    const { idpedidos } = req.params;
    const { notificacion, valor } = req.body;

    const response = await Pedidos.update(
      {
        [notificacion]: valor,
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

async function obtenerConfigPronostico(req, res) {
  try {
    const response = obtenerConfiguraciones().configPronosticos;

    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

async function escribirConfigPronostico(req, res) {
  try {
    for (const element of req.body) {
      const { propiedad, estacion, combustible, valor } = element;
      const config = obtenerConfiguraciones().configPronosticos;
      config[propiedad][estacion][combustible] = Number(valor);
      escribirConfiguraciones({ configPronosticos: config });
      if (propiedad === "limite") {
        await sequelize.transaction(async (t) => {
          const idpronostico = await Pronosticos.findOne({
            where: {
              combustible,
              idestacion_servicio: Number(estacion.replace("gdl", "")),
            },
            order: [["idpronostico", "DESC"]],
            transaction: t,
          });

          const update = await Pronosticos.update(
            { limite: valor },
            {
              where: { idpronostico: idpronostico.dataValues.idpronostico },
              transaction: t,
            }
          );
          return update;
        });
      }
    }

    res.status(200).json({ success: true, response: true });
  } catch (err) {
    console.log(err);

    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

async function consultar(req, res) {
  try {
    const response = await Pronosticos.findAll({
      where: { combustible: "M", idestacion_servicio: 1 },
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);

    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la información" });
  }
}

export default {
  obtenerPronosticosXcombustible,
  obtenerPronosticosXES,
  obtenerConfigPronostico,
  escribirConfigPronostico,
  guardarPronostico,
  editarPronostico,
  guardarPedidos,
  obtenerPedidos,
  editarInformacionPedidos,
  notificarPedidos,
  eliminarPedidos,
  editarPedidos,
  antesEigualDe,
  obtenerReportesPedidos,
  consultar,
};
