// import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import modelos from "../models/";
import sequelize from "../config/configdb";
import { insertarMf } from "./d.montoFaltante.controller";
import { Op, literal } from "sequelize";
import { attributesPersonal } from "../models/recursosHumanos/empleados.model";
import calcularTotal from "../assets/sumarAlgo";
import Decimal from "decimal.js-light";
const {
  LiquidacionesV2,
  Liquidaciones,
  ES,
  Horarios,
  empleados,
  Turnos,
  Vales,
  Efectivo,
  InfoLecturas,
  LecturasFinales,
  Auditoria,
  Precios,
  CodigosUso,
} = modelos;
const { verificar } = auth;

const controller = {};
const area = "Liquidación";

controller.insertarLiquidos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { lecturas, vales, efectivo, folio, checkMF, diferencia } = req.body;
    if (lecturas.length < 1 || efectivo.length < 1) {
      throw {
        code: 400,
        msg: "No se están enviando los datos completos, corroborar las lecturas, captura de efectivos y vales",
      };
    }

    const cuerpoVales = vales.map((el) => ({
      monto: el.monto,
      combustible: el.combustible,
      idliquidacion: folio,
      folio: el.folio || null,
      label: el.label,
      idcodigo_uso: el.codigoUso,
    }));

    const cuerpoEfectivo = efectivo.map((el) => ({
      monto: el.monto,
      idliquidacion: folio,
      folio: el.folio,
      idcodigo_uso: el.codigoUso,
    }));

    const response = await sequelize.transaction(async (t) => {
      const liquidacion = await Liquidaciones.findByPk(folio, {
        include: [{ model: Horarios }],
        transaction: t,
      });
      const vales = await Vales.bulkCreate(cuerpoVales, { transaction: t });
      const efectivo = await Efectivo.bulkCreate(cuerpoEfectivo, {
        transaction: t,
      });
      const cuerpoinfoLect = {
        fecha: liquidacion.horario.fechaliquidacion,
        idliquidacion: folio,
        idestacion_servicio: liquidacion.horario.idestacion_servicio,
      };

      const infoLect = await InfoLecturas.create(cuerpoinfoLect, {
        transaction: t,
      });

      const cuerpoLectF = lecturas.map((el) => ({
        idmanguera: el.manguera,
        idinfo_lectura: infoLect.idinfo_lectura,
        lecturai: el.lecturaInicial,
        lecturaf: el.lecturaFinal,
        precio: el.precioUnitario,
        importe: el.importe,
      }));

      const lectF = await LecturasFinales.bulkCreate(cuerpoLectF, {
        transaction: t,
      });

      const liquidaciones = await LiquidacionesV2.update(
        {
          lecturas: JSON.stringify(lecturas),
          capturado: true,
          efectivo_entregado: calcularTotal(cuerpoEfectivo, "monto"),
          vales_entregado: calcularTotal(cuerpoVales, "monto"),
          idempleado_captura: user.token.data.datos.idempleado,
        },
        {
          where: { idliquidacion: folio },
          transaction: t,
          individualHooks: true,
        }
      );

      if (checkMF && diferencia > 0) {
        await insertarMf(req, res, {
          idempleado: liquidacion.dataValues.horario.dataValues.idempleado,
          fecha: liquidacion.dataValues.horario.dataValues.fechaliquidacion,
          cantidad: diferencia,
        });
      }

      await Auditoria.create(
        {
          peticion: area,
          idempleado: user.token.data.datos.idempleado,
          accion: 2,
          idaffectado: folio,
        },
        { transaction: t }
      );

      return { vales, efectivo, infoLect, lectF, liquidaciones };
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

controller.cancelarLiquido = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha, idLiquidacion, motivo } = req.body;

    const infoLiq = await Liquidaciones.findByPk(idLiquidacion, {
      include: Horarios,
    });

    const lecturas = await LecturasFinales.findAll({
      include: [
        { model: InfoLecturas, where: { idliquidacion: idLiquidacion } },
      ],
    });

    const mangueras = lecturas.map((el) => el.dataValues.idmanguera);

    LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
    InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

    //Estas liquidaciones comprueban si hay liquidaciones siguientes a esta liquidacion, si hay entonces no puedo cancelar la liquidacion por las lecturas finales.
    const liquidacionesSiguientes = await Liquidaciones.findAll({
      where: { capturado: true, cancelado: { [Op.is]: null } },
      include: [
        {
          model: InfoLecturas,
          include: [
            {
              model: LecturasFinales,
              where: { idmanguera: { [Op.in]: mangueras } },
            },
          ],
        },
        {
          model: Horarios,
          where: {
            idestacion_servicio:
              infoLiq.dataValues.horario.dataValues.idestacion_servicio,
            fechaturno: {
              [Op.gt]: infoLiq.dataValues.horario.dataValues.fechaturno,
            },
          },
        },
      ],
    });

    if (liquidacionesSiguientes.length > 0) {
      throw {
        code: 417,
        msg: "Liquidaciones dependientes",
        liquidacionesSiguientes,
      };
    }

    const response = await sequelize.transaction(async (t) => {
      const liquidacion = await Liquidaciones.update(
        {
          cancelado: motivo,
          fechaCancelado: fecha,
        },
        { where: { idliquidacion: idLiquidacion }, transaction: t }
      );

      const lecturasF = await InfoLecturas.update(
        { cancelado: true },
        { where: { idliquidacion: idLiquidacion }, transaction: t }
      );

      const nuevaLiquidacion = await Liquidaciones.create(
        {
          idhorario: infoLiq.idhorario,
          idislas: infoLiq.idislas,
        },
        { transaction: t }
      );

      await Auditoria.create(
        {
          peticion: "Cancelar Liquidación",
          idempleado: user.token.data.datos.idempleado,
          accion: 4,
          idaffectado: idLiquidacion,
        },
        { transaction: t }
      );

      return { liquidacion, lecturasF, nuevaLiquidacion };
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

//Sirve para almacenar el folio de una liquidacion y evitar problemas de liquidaciones duplicadas
controller.reservarFolio = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;
    const idempleadoC = user.token.data.datos.idempleado;

    const cuerpo = {
      capturado: true,
      idempleado_captura: idempleadoC,
      paginacion: JSON.stringify(req.body),
    };

    const response = await Liquidaciones.update(cuerpo, {
      where: { idliquidacion: folio },
    });

    await Auditoria.create({
      peticion: "Reservar Liquidación",
      idempleado: user.token.data.datos.idempleado,
      accion: 3,
      idaffectado: folio,
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.quitarReservarFolio = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;

    const cuerpo = { capturado: 0, idempleado_captura: null, paginacion: null };

    const liquidacion = await Liquidaciones.findByPk(folio);

    let response = [1];

    if (!liquidacion) {
      res.status(200).json({ success: true, response });
      return;
    }

    if (!liquidacion.lecturas) {
      response = await Liquidaciones.update(cuerpo, {
        where: { idliquidacion: folio },
      });
    }

    await Auditoria.create({
      peticion: "Reservar Liquidación",
      idempleado: user.token.data.datos.idempleado,
      accion: 4,
      idaffectado: folio,
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

controller.imprimir = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;

    const response = await Liquidaciones.findByPk(folio, {
      attributes: ["num_impresiones"],
    });

    await Liquidaciones.update(
      { num_impresiones: response.dataValues.num_impresiones + 1 },
      { where: { idliquidacion: folio }, silent: true }
    );

    await Auditoria.create({
      peticion: "Impresión Liquidación",
      idempleado: user.token.data.datos.idempleado,
      accion: 1,
      idaffectado: folio,
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

controller.administrarMfMs = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;
    const { show_mf, show_ms } = req.body;

    const response = await Liquidaciones.update(
      { show_mf, show_ms },
      { where: { idliquidacion: folio }, silent: true }
    );

    await Auditoria.create({
      peticion: "Actualización mostrar MF o MS",
      idempleado: user.token.data.datos.idempleado,
      accion: 1,
      idaffectado: folio,
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

controller.showMfMs = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { order, limit, offset } = req.query;

    const response = await Liquidaciones.findAndCountAll({
      where: { [Op.or]: [{ show_ms: false }, { show_mf: false }] },
      order: [["idliquidacion", order || "DESC"]],
      include: [
        {
          model: Horarios,
          include: [{ model: empleados, attributes: attributesPersonal }],
        },
      ],
      offset: offset ? Number(offset) : null,
      limit: limit ? Number(limit) || 10 : null,
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

controller.liquidacionesPendientes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha, idEstacion } = req.query;
    let fechasAnteriores = new Date(fecha);
    fechasAnteriores = new Date(
      fechasAnteriores.setDate(fechasAnteriores.getDate() - 1)
    )
      .toISOString()
      .split("T")[0];

    const response = await Liquidaciones.findAll({
      include: [
        {
          model: Horarios,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
          where: { fechaturno: fecha, idestacion_servicio: idEstacion },
        },
        { model: empleados, as: "empleado_captura" },
      ],
    });

    const anteriores = await Liquidaciones.findAll({
      where: { lecturas: null },
      include: [
        {
          model: Horarios,
          where: { fechaturno: { [Op.lte]: fechasAnteriores } },
        },
      ],
      order: [[Horarios, "fechaturno", "ASC"]],
    });

    const totalLiquidaciones = response.filter((liq) => !liq.cancelado).length;

    res
      .status(200)
      .json({ success: true, response, totalLiquidaciones, anteriores });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.acarreo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const { fechaI, fechaF, idEmpleado, idEstacion } = req.query;
    const filtrosHorario = {};

    if (fechaI && fechaF) {
      filtrosHorario.fechaturno = { [Op.between]: [fechaI, fechaF] };
    }

    if (idEmpleado) {
      filtrosHorario.idempleado = idEmpleado;
    }

    if (idEstacion) {
      filtrosHorario.idestacion_servicio = idEstacion;
    }

    const response = await Vales.findAll({
      where: { idcodigo_uso: ["C", "Z"] },
      include: [
        {
          model: Liquidaciones,
          attributes: ["idliquidacion", "lecturas", "idislas"],
          include: [
            {
              model: Horarios,
              attributes: [
                "idempleado",
                "fechaturno",
                "idturno",
                "fechaliquidacion",
                "idhorario",
                "idestacion_servicio",
              ],
              where: filtrosHorario,
            },
          ],
        },
      ],
    });

    const respon = response
      .filter((el) => el.liquidacione)
      .map((el) => {
        const datos = JSON.parse(el.dataValues.liquidacione.lecturas);
        const { precioUnitario, combustible, idisla } = datos.find(
          (d) => d.idgas === el.combustible
        );

        const dataIsla = el.dataValues.liquidacione.idislas;

        const nisla = dataIsla.find((isla) => isla.idisla === idisla).nisla;

        const {
          idempleado,
          fechaturno,
          fechaliquidacion,
          idturno,
          idestacion_servicio,
        } = el.dataValues.liquidacione.horario;
        const monto = el.dataValues.monto;
        const litrosJarreados = new Decimal(monto)
          .div(precioUnitario)
          .toNumber();

        return {
          idvale: el.dataValues.idvale,
          idgas: el.dataValues.combustible,
          monto,
          litrosJarreados,
          idcodigo_uso: el.dataValues.idcodigo_uso,
          precioUnitario,
          combustible,
          idliquidacion: el.dataValues.liquidacione.idliquidacion,
          idempleado,
          idturno,
          fechaturno,
          fechaliquidacion,
          idisla,
          nisla,
          idestacion_servicio,
        };
      });
    res.status(200).json({ success: true, response: respon });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.consultarLiquido = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idliquidacion } = req.params;

    LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
    InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

    const response = await Liquidaciones.findByPk(idliquidacion, {
      include: [
        {
          model: Horarios,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        },
        { model: Efectivo },
        { model: Vales },
        { model: InfoLecturas, include: LecturasFinales },
      ],
    });

    const { fechaturno, turno } = response.dataValues.horario.dataValues;

    const cambioPrecios = await Precios.findOne({
      where: { fecha: `${fechaturno} ${turno.dataValues.hora_empiezo}` },
    });

    console.log(cambioPrecios);

    const totalLiquidos = await Liquidaciones.findAll({
      where: { cancelado: null },
      include: [
        {
          model: Horarios,
          where: {
            fechaturno: response.dataValues.horario.dataValues.fechaturno,
            idestacion_servicio:
              response.dataValues.horario.dataValues.idestacion_servicio,
          },
        },
      ],
      order: [["createdAt", "ASC"]], //Esto afecta el folio de la liquidacion **
    });

    res.status(200).json({
      success: true,
      response,
      totalLiquidos: totalLiquidos,
      cambioPrecios: cambioPrecios ? true : false,
    });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.consultarLiquidoHistorial = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fechaI, fechaF, filtro } = req.query;
    const querysL = {};
    const querys = {};

    if (fechaI && fechaF) {
      querysL.fechaturno = {
        [Op.between]: [fechaI, fechaF],
      };
    }

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

        default:
          break;
      }
    }

    const response = await LiquidacionesV2.findAll({
      where: querys,
      include: [
        {
          model: Horarios,
          where: querysL,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        },
        { model: empleados, as: "empleado_captura" },
      ],
      order: [
        [Horarios, "fechaturno", "DESC"],
        ["updatedAt", "DESC"],
      ],
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

controller.consultaFolios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { filtrarFolio, fechaI, fechaF, excluirCU } = req.query;
    const filtros = { [Op.and]: [] };

    if (fechaI) {
      if (fechaF) {
        filtros[Op.and] = [
          ...filtros[Op.and],
          literal(`fechaturno BETWEEN '${fechaI}' AND '${fechaF}'`),
        ];
      } else {
        filtros[Op.and] = [
          ...filtros[Op.and],
          sequelize.literal(`fechaturno > ${fechaI}`),
        ];
      }
    }

    if (filtrarFolio) {
      const folios = Array.isArray(filtrarFolio)
        ? filtrarFolio
        : [filtrarFolio];
      filtros[Op.and] = [...filtros[Op.and], { folio: folios }];
    }

    if (excluirCU) {
      const codigos = Array.isArray(excluirCU) ? excluirCU : [excluirCU];
      filtros[Op.and] = [
        ...filtros[Op.and],
        { idcodigo_uso: { [Op.notIn]: [codigos] } },
      ];
    }

    const efectivos = await Efectivo.findAll({
      include: [
        {
          model: Liquidaciones,
          attributes: ["idliquidacion"],
          include: [
            {
              model: Horarios,
              attributes: ["fechaturno"],
            },
          ],
        },
        { model: CodigosUso, attributes: ["descripcion"] },
      ],
      where: filtros,
    });

    const vales = await Vales.findAll({
      include: [
        {
          model: Liquidaciones,
          attributes: ["idliquidacion"],
          include: [
            {
              model: Horarios,
              attributes: ["fechaturno"],
            },
          ],
        },
        { model: CodigosUso, attributes: ["descripcion"] },
      ],
      where: filtros,
    });

    res.status(200).json({ success: true, response: { efectivos, vales } });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.reporteDashboard = async (req, res) => {
  try {
    const { fechaI, fechaF, estacionS, idEmpleado, idTurno } = req.query;
    const filtrosHorario = {};

    if (fechaI && fechaF) {
      filtrosHorario.fechaturno = { [Op.between]: [fechaI, fechaF] };
    }

    if (estacionS) filtrosHorario.idestacion_servicio = estacionS;
    if (idEmpleado) filtrosHorario.idempleado = idEmpleado;
    if (idTurno) filtrosHorario.idturno = idTurno;

    const response = await LiquidacionesV2.findAll({
      include: [
        {
          model: Horarios,
          attributes: ["idhorario", "fechaturno", "idempleado", "idturno"],
          where: filtrosHorario,
          include: [
            { model: empleados, attributes: attributesPersonal },
            { model: Turnos },
            { model: ES },
          ],
        },
      ],
      where: {
        cancelado: { [Op.is]: null },
        lecturas: { [Op.not]: null },
        capturado: true,
      },
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

controller.reporteVentasDias = async (req, res) => {
  try {
    const { fechaI, fechaF, estacionS, idEmpleado, idTurno, idIsla, posicion } =
      req.query;
    const filtrosHorario = {};

    if (fechaI && fechaF) {
      filtrosHorario.fechaturno = { [Op.between]: [fechaI, fechaF] };
    }

    if (estacionS) filtrosHorario.idestacion_servicio = estacionS;
    if (idEmpleado) filtrosHorario.idempleado = idEmpleado;
    if (idTurno) filtrosHorario.idturno = idTurno;

    const response = await LiquidacionesV2.findAll({
      include: [
        {
          model: Horarios,
          attributes: ["idhorario", "fechaturno", "idempleado", "idturno"],
          where: filtrosHorario,
          include: [
            { model: empleados, attributes: attributesPersonal },
            { model: Turnos },
            { model: ES },
          ],
        },
      ],
      where: {
        cancelado: { [Op.is]: null },
        lecturas: { [Op.not]: null },
        capturado: true,
      },
    });

    //if()]*¨[]

    if (idIsla) {
      const lecturasRes = response.map((liq) => {
        const lecturas = JSON.parse(liq.dataValues.lecturas);
        const filtrarIslas = !posicion
          ? lecturas.filter((isla) => isla.idisla === Number(idIsla))
          : lecturas.filter(
              (isla) =>
                isla.idisla === Number(idIsla) &&
                isla.posicion === Number(posicion)
            );
        return {
          ...JSON.parse(JSON.stringify(liq)),
          lecturas: JSON.stringify(filtrarIslas),
        };
      });

      return res.status(200).json({ success: true, response: lecturasRes });
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
