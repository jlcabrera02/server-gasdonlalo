// import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import modelos from "../models/";
import sequelize from "../config/configdb";
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
} = modelos;
const { verificar } = auth;

const controller = {};

controller.insertarLiquidos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { lecturas, vales, efectivo, folio } = req.body;
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

    const cuerpoEfectivo = vales.map((el) => ({
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
        { where: { idliquidacion: folio } },
        { transaction: t }
      );

      return { vales, efectivo, infoLect, lectF, liquidaciones };
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

controller.cancelarLiquido = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha, idLiquidacion, motivo } = req.body;

    const response = await sequelize.transaction(async (t) => {
      const infoLiq = await Liquidaciones.findByPk(idLiquidacion, {
        transaction: t,
      });
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

      const nuevaLiquidacion = await Liquidaciones.create({
        idhorario: infoLiq.idhorario,
      });

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
      idempleado_autoriza: idempleadoC,
      paginacion: JSON.stringify(req.body),
    };

    const response = await Liquidaciones.update(cuerpo, {
      where: { idliquidacion: folio },
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

    const response = await Liquidaciones.update(cuerpo, {
      where: { idliquidacion: folio },
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

controller.liquidacionesPendientes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha } = req.query;

    const response = await Liquidaciones.findAll({
      include: [
        {
          model: Horarios,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
          where: { fechaliquidacion: fecha },
        },
      ],
    });

    const totalLiquidaciones = response.filter((liq) => !liq.cancelado).length;

    res.status(200).json({ success: true, response, totalLiquidaciones });
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
      include: [
        {
          model: Horarios,
          where: {
            fechaliquidacion:
              response.dataValues.horario.dataValues.fechaliquidacion,
            idestacion_servicio:
              response.dataValues.horario.dataValues.idestacion_servicio,
          },
        },
      ],
    });

    res
      .status(200)
      .json({ success: true, response, total: totalLiquidos.length });
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
