import estSerM from "../models/ad.estacionService.model";
import auth from "../models/auth.model";
import tp from "../assets/formatTiempo";
import models from "../models/";
import { Op } from "sequelize";
import sequelize from "../config/configdb";
const { Horarios, empleados, Liquidaciones, Turnos } = models;
const { diff, tiempoDB, tiempoHorario } = tp;
const { verificar } = auth;

const controller = {};

controller.obtenerHorario = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fechaI, fechaF } = req.query;
    const fechaFinal = fechaF ? fechaF : fechaI;

    console.log([fechaI, fechaFinal]);

    const response = await Horarios.findAll({
      where: {
        fechaturno: { [Op.between]: [fechaI, fechaFinal] },
      },
      include: [{ model: empleados }, { model: Turnos }],
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

controller.nuevoHorario = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, idTurno, fechaTurno, idEstacion } = req.body;
    const turno = await estSerM.findTurnoById(idTurno);
    const { hora_empiezo, hora_termino } = turno;

    let diaMayor =
      Number(hora_empiezo.split(":")[0]) > Number(hora_termino.split(":")[0]);

    const horaDiff = diaMayor
      ? diff("2022-12-15", hora_termino) - diff("2022-12-14", hora_empiezo)
      : diff("2022-12-14", hora_termino) - diff("2022-12-14", hora_empiezo);

    const fecha = tiempoHorario(`${fechaTurno} ${hora_empiezo}`);
    const fechaLiquidacion = tiempoDB(new Date(fecha.getTime() + horaDiff));

    const cuerpo = {
      idempleado: idEmpleado,
      idturno: idTurno,
      fechaturno: fechaTurno,
      fechaliquidacion: fechaLiquidacion,
      idestacion_servicio: idEstacion,
    };

    const validar = await Horarios.findOne({
      where: {
        idempleado: idEmpleado,
        idturno: idTurno,
        fechaturno: fechaTurno,
      },
    });
    if (validar)
      throw {
        success: false,
        code: 400,
        msg: "Ya existe un horario para este operador",
      };

    const response = await sequelize.transaction(async (tr) => {
      const horarios = await Horarios.create(cuerpo, { transaction: tr });
      const liquidaciones = await Liquidaciones.create({
        idhorario: horarios.idhorario,
      });
      return { horarios, liquidaciones };
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

controller.actualizarHorario = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idHorario } = req.params;
    const { idEmpleado, idTurno, fechaTurno, idEstacion } = req.body;
    const turno = await estSerM.findTurnoById(idTurno);
    const { hora_empiezo, hora_termino } = turno;

    let diaMayor =
      Number(hora_empiezo.split(":")[0]) > Number(hora_termino.split(":")[0]);

    const horaDiff = diaMayor
      ? diff("2022-12-15", hora_termino) - diff("2022-12-14", hora_empiezo)
      : diff("2022-12-14", hora_termino) - diff("2022-12-14", hora_empiezo);

    const fecha = tiempoHorario(`${fechaTurno} ${hora_empiezo}`);
    const fechaLiquidacion = tiempoDB(new Date(fecha.getTime() + horaDiff));

    const cuerpo = {
      idempleado: idEmpleado,
      idturno: idTurno,
      fechaturno: fechaTurno,
      fechaliquidacion: fechaLiquidacion,
      idestacion_servicio: idEstacion,
    };

    const response = await Horarios.update(cuerpo, {
      where: { idhorario: idHorario },
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

controller.eliminarHorario = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idHorario } = req.params;
    const liquidacion = await Liquidaciones.findOne({
      where: { idhorario: idHorario },
    });
    if (liquidacion) {
      if (liquidacion.capturado && !liquidacion.fechaCancelado)
        throw {
          code: 400,
          msg: "El horario tiene una liquidación que ya se capuro o se esta capturando, para eliminar el horario debe cancelar la liquidación asociada a esté horario",
        };
    }

    const response = await sequelize.transaction(async (t) => {
      const liquidacion = await Liquidaciones.destroy(
        {
          where: { idhorario: idHorario },
        },
        { transaction: t }
      );

      const horario = await Horarios.destroy(
        {
          where: { idhorario: idHorario },
        },
        { transaction: t }
      );

      return { liquidacion, horario };
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

export default controller;
