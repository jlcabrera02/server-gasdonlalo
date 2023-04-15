import horM from "../models/l.horarios.model";
import estSerM from "../models/ad.estacionService.model";
import liqM from "../models/l.liquido.model";
import auth from "../models/auth.model";
import tp from "../assets/formatTiempo";
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

    const response = await horM.obtenerHorario([fechaI, fechaFinal]);

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

    const response = await horM.insertarHorarios([
      idEmpleado,
      idTurno,
      fechaTurno,
      fechaLiquidacion,
      idEstacion,
    ]);

    await liqM.generarFolios(response.insertId);

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

    const response = await horM.updateHorario([
      {
        idempleado: idEmpleado,
        idturno: idTurno,
        fechaturno: fechaTurno,
        fechaliquidacion: fechaLiquidacion,
        idestacion_servicio: idEstacion,
      },
      idHorario,
    ]);

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
    // const { idEmpleado, idTurno, fechaTurno, idEstacion } = req.body;
    const liquidacion = await liqM.liquidacionByFolio(idHorario);
    if (liquidacion) {
      if (liquidacion.capturado && !liquidacion.fechaCancelado)
        throw {
          code: 400,
          msg: "El horario tiene una liquidación que ya se capuro o se esta capturando, para eliminar el horario debe cancelar la liquidación asociada a esté horario",
        };
    }

    await liqM.deleteLiquido(idHorario);

    const response = await horM.eliminarHorario(idHorario);

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
