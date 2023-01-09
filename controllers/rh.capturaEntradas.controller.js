import ceM from "../models/rh.capturaEntradas.model";
import tp from "../assets/formatTiempo";
const { tiempoDB, transformMinute, diff } = tp;

const controller = {};

controller.findEntradasXidEmpleadoXMes = async (req, res) => {
  try {
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    let response = await ceM.findEntradasXidEmpleadoXMes(idEmpleado, fecha);

    response = response.map((el) => {
      const minutosDiff =
        diff(tiempoDB(el.fecha), el.hora_anticipo) -
        diff(tiempoDB(el.fecha), el.hora_entrada);
      return {
        ...el,
        minutosRetardos:
          minutosDiff > 0 ? "00:00" : transformMinute(minutosDiff),
      };
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

controller.findRetardosXsemanas = async (req, res) => {
  try {
    const { idEmpleado } = req.params;
    const { dateStart, dateEnd } = req.body;
    const cuerpo = [Number(idEmpleado), dateStart, dateEnd];

    let response = await ceM.findRetardosXsemanas(cuerpo);

    response = response.map((el) => {
      const minutosDiff =
        diff(tiempoDB(el.fecha), el.hora_anticipo) -
        diff(tiempoDB(el.fecha), el.hora_entrada);
      return {
        ...el,
        minutosRetardos:
          minutosDiff > 0 ? "00:00" : transformMinute(minutosDiff),
      };
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

controller.findFalta = async (req, res) => {
  try {
    const response = await ceM.findFalta();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.semanasXmes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let diasDelMes = new Date(year, month, 0).getDate();
    let primerSabado;
    const response = [];
    for (let i = 0; i < diasDelMes; i++) {
      let a = new Date(`${year}-${month}-${i}`).getDay();
      if (a === 5) {
        primerSabado = i + 1;
        break;
      }
    }

    for (let i = primerSabado; i < diasDelMes - 2; i++) {
      let firstFecha = `${year}-${month}-${i}`;

      if (primerSabado > 2 && i < primerSabado + 7) {
        let tiempo = new Date(
          new Date(firstFecha).setDate(new Date(firstFecha).getDate() - 7)
        )
          .toISOString()
          .split("T")[0];

        let tiempod = new Date(
          new Date(tiempo).setDate(new Date(tiempo).getDate() + 6)
        )
          .toISOString()
          .split("T")[0];

        response.push({
          semana: 1,
          diaEmpiezo: tiempo,
          diaTermino: tiempod,
        });
      }

      let lastFecha = new Date(
        new Date(firstFecha).setDate(new Date(firstFecha).getDay() + i)
      )
        .toISOString()
        .split("T")[0];
      let index = response.length;
      response.push({
        semana: index + 1,
        diaEmpiezo: firstFecha,
        diaTermino: lastFecha,
      });
      i = i + 6;
    }

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    const { idEmpleado, horaEntrada, fecha, idTurno, idTipoFalta } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      hora_entrada: horaEntrada,
      fecha,
      idturno: Number(idTurno),
      idtipo_falta: Number(idTipoFalta),
    };

    if (!idTipoFalta) cuerpo.idtipo_falta = 1;

    console.log(cuerpo);

    await ceM.validarDuplicados([cuerpo.idempleado, fecha, cuerpo.idturno]); // Validar existencia

    const horaAnticipo = await ceM.horaAnticipo(cuerpo.idturno);
    let minutosDiff = diff(fecha, horaAnticipo) - diff(fecha, horaEntrada);
    minutosDiff > 0
      ? (cuerpo.idtipo_falta = 1)
      : (cuerpo.idtipo_falta = cuerpo.idtipo_falta);

    const response = await ceM.insert(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    const { idempleado, idcontrolDocumento } = req.body;

    const cuerpo = [idcontrolDocumento, idempleado];
    let response = await ceM.update(cuerpo);
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
