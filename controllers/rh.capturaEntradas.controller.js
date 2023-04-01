import ceM from "../models/rh.capturaEntradas.model";
import tp from "../assets/formatTiempo";
import auth from "../models/auth.model";
import empM from "../models/rh.empleado.model";
// import sncaM from "../models/s.acumular.model";
const { verificar } = auth;
const { tiempoDB, transformMinute, diff } = tp;

const controller = {};

controller.findEntradasXidEmpleadoXMes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findRetardosXsemanas = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const { dateStart, dateEnd } = req.body;
    const cuerpo = [Number(idEmpleado), dateStart, dateEnd];

    const empleado = await empM.findOne(idEmpleado);
    const entradas = await ceM.findRetardosXsemanas(cuerpo);
    // findTurno;

    const response = [];
    for (let i = 0; i < entradas.length; i++) {
      // let temp = {};
      const rec = entradas[i];
      let temp = { ...rec, empleado: empleado[0] };
      if (temp.idtipo_falta) {
        let tipoFalta = await ceM.findFaltas(temp.idtipo_falta);
        temp = { ...temp, tipo_falta: tipoFalta[0] };
      }

      if (temp.idturno) {
        let turno = await ceM.findTurno(temp.idturno);
        temp = { ...temp, turno: turno[0].turno };
      } else {
        temp = { ...temp, turno: null };
      }

      response.push(temp);
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findFalta = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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

controller.findTurnos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const response = await ceM.findTurnos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

//Saca una relacion de semanas de las que obtiene el mes
controller.semanasXmes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado, horaEntrada, fecha, idTurno } = req.body;
    const cuerpo = {
      idempleado: Number(idEmpleado),
      hora_entrada: horaEntrada,
      fecha,
      idturno: Number(idTurno) || 1,
    };

    await ceM.validarDuplicados([cuerpo.idempleado, fecha, cuerpo.idturno]); // Validar existencia

    const horaAnticipo = await ceM.horaAnticipo(cuerpo.idturno);
    let minutosDiff = diff(fecha, horaAnticipo) - diff(fecha, horaEntrada);
    const minutosRetardos =
      minutosDiff > 0 ? "00:00" : transformMinute(minutosDiff);

    cuerpo["minutos_retardos"] = minutosRetardos;

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

controller.insertDescanso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { fecha, idEmpleado } = req.body;
    const cuerpo = {
      idempleado: idEmpleado,
      fecha,
      idtipo_falta: 3,
    };
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

controller.insertTurno = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { turno, hora_empiezo, hora_termino, hora_anticipo } = req.body;

    const cuerpo = [turno, hora_empiezo, hora_termino, hora_anticipo];

    let response = await ceM.insertTurnos(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateTurno = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idTurno, turno, hora_empiezo, hora_termino, hora_anticipo } =
      req.body;

    const cuerpo = [
      {
        turno,
        hora_empiezo,
        hora_termino,
        hora_anticipo,
      },
      idTurno,
    ];

    let response = await ceM.updateTurnos(cuerpo);
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idCaptura, idTipoFalta, minutosR } = req.body;

    const cuerpo = [
      {
        idtipo_falta: idTipoFalta,
      },
      idCaptura,
    ];
    if (minutosR) cuerpo[0]["minutos_retardos"] = minutosR;
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

controller.deleteTurno = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idTurno } = req.params;
    let response = await ceM.deleteTurno(idTurno);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idCaptura } = req.params;
    let response = await ceM.delete(idCaptura);
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
