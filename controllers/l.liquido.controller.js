// import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import modelos from "../models/";
import sequelize from "../config/configdb";
import { insertarMf } from "./d.montoFaltante.controller";
import { Op } from "sequelize";
const {
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
  Mangueras,
  Gas,
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
    }));

    const cuerpoEfectivo = efectivo.map((el) => ({
      monto: el.monto,
      idliquidacion: folio,
      folio: el.folio,
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

      const liquidaciones = await Liquidaciones.update(
        {
          lecturas: JSON.stringify(lecturas),
          capturado: true,
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
      where: { capturado: true },
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
      console.log(err);
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

    res
      .status(200)
      .json({ success: true, response, totalLiquidos: totalLiquidos });
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
    const { fechaI, fechaF, cancelado } = req.query;
    const querysL = {};
    const querys = { capturado: true };

    if (fechaI && fechaF) {
      querysL.fechaturno = {
        [Op.between]: [fechaI, fechaF],
      };
    }

    if (cancelado) {
      console.log(cancelado);
      querys.cancelado = cancelado === "true" ? false : null;
    }

    LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
    InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

    const response = await Liquidaciones.findAll({
      where: querys,
      include: [
        {
          model: Horarios,
          where: querysL,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        },
        { model: Efectivo },
        { model: Vales },
        { model: InfoLecturas, include: LecturasFinales },
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

export default controller;
