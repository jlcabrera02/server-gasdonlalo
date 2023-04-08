import ceM from "../models/rh.capturaEntradas.model";
import { guardarBitacora } from "../models/auditorias";
import tp from "../assets/formatTiempo";
import auth from "../models/auth.model";
import empM from "../models/rh.empleado.model";
import sncaM from "../models/s.acumular.model";
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
      let temp = {};
      const rec = entradas[i];
      temp = { ...rec, empleado: empleado[0] };
      if (temp.idtipo_falta) {
        let tipoFalta = await ceM.findFaltas(temp.idtipo_falta);
        temp = { ...temp, tipo_falta: tipoFalta[0] };
      }

      if (temp.idturno) {
        let turno = await ceM.findTurno(temp.idturno);
        if (turno) {
          temp = { ...temp, turno: turno[0].turno };
        } else {
          temp = { ...temp, turno: "eliminado" };
        }
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

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado, horaEntrada, fecha, horaEstablecida } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      hora_entrada: horaEntrada,
      fecha,
      hora_establecida: horaEstablecida,
    };

    await ceM.validarDuplicados([cuerpo.idempleado, fecha, cuerpo.idturno]); // Validar existencia

    let minutosDiff = diff(fecha, horaEstablecida) - diff(fecha, horaEntrada);
    const minutosRetardos =
      minutosDiff > 0 ? "00:00" : transformMinute(minutosDiff);

    cuerpo["minutos_retardos"] = minutosRetardos;

    const response = await ceM.insert(cuerpo);

    await guardarBitacora([
      "Captura Entradas",
      user.token.data.datos.idempleado,
      2,
      response.insertId,
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
    await guardarBitacora([
      "Captura Entradas",
      user.token.data.datos.idempleado,
      3,
      response.insertId,
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

controller.insertTurno = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { turno, hora_empiezo, hora_termino, hora_anticipo } = req.body;

    const cuerpo = [turno, hora_empiezo, hora_termino, hora_anticipo];

    let response = await ceM.insertTurnos(cuerpo);

    await guardarBitacora([
      "Turnos",
      user.token.data.datos.idempleado,
      2,
      response.insertId,
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

    await guardarBitacora([
      "Turnos",
      user.token.data.datos.idempleado,
      3,
      idTurno,
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

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idCaptura, idTipoFalta, minutosR } = req.body;
    let ceViejo = await ceM.findOne(idCaptura);
    let validar = [];
    const fecha = tiempoDB(ceViejo.fecha);

    const cuerpo = [
      {
        idtipo_falta: idTipoFalta,
      },
      idCaptura,
    ];
    if (minutosR) cuerpo[0]["minutos_retardos"] = minutosR;
    let response = await ceM.update(cuerpo);

    if (ceViejo.idtipo_falta) {
      if (
        ceViejo.idtipo_falta === 4 ||
        ceViejo.idtipo_falta === 5 ||
        ceViejo.idtipo_falta === 7
      ) {
        let idInc = 0;
        if (ceViejo.idtipo_falta === 4) idInc = 8;
        if (ceViejo.idtipo_falta === 5) idInc = 2;
        if (ceViejo.idtipo_falta === 7) idInc = 4;
        validar = await sncaM.validar([ceViejo.idempleado, idInc, fecha]);
      }
    }

    if (validar.length > 0) {
      await sncaM.delete(validar[0].idsncacumuladas);
    }

    if (idTipoFalta == 4 || idTipoFalta == 5 || idTipoFalta == 7) {
      let text = "";
      let inc = 0;
      if (idTipoFalta == 4) (text = "Inconformidad por falta"), (inc = 8);
      if (idTipoFalta == 5) (text = "Inconformidad por retardo"), (inc = 2);
      if (idTipoFalta == 7)
        (text = "Inconformidad por no chechar entrada"), (inc = 4);

      await sncaM.insert([inc, ceViejo.idempleado, fecha, text]);
    }

    await guardarBitacora([
      "Captura Entradas",
      user.token.data.datos.idempleado,
      3,
      idCaptura,
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

controller.deleteTurno = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idTurno } = req.params;
    let response = await ceM.deleteTurno(idTurno);
    await guardarBitacora([
      "Turnos",
      user.token.data.datos.idempleado,
      4,
      idTurno,
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

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idCaptura } = req.params;
    let ceViejo = await ceM.findOne(idCaptura);
    let validar = [];
    const fecha = tiempoDB(ceViejo.fecha);

    if (ceViejo.idtipo_falta) {
      if (
        ceViejo.idtipo_falta === 4 ||
        ceViejo.idtipo_falta === 5 ||
        ceViejo.idtipo_falta === 7
      ) {
        let idInc = 0;
        if (ceViejo.idtipo_falta === 4) idInc = 8;
        if (ceViejo.idtipo_falta === 5) idInc = 2;
        if (ceViejo.idtipo_falta === 7) idInc = 4;
        validar = await sncaM.validar([ceViejo.idempleado, idInc, fecha]);
      }
    }

    let response = await ceM.delete(idCaptura);

    if (validar.length > 0) {
      await sncaM.delete(validar[0].idsncacumuladas);
    }

    await guardarBitacora([
      "Captura Entradas",
      user.token.data.datos.idempleado,
      4,
      idCaptura,
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

export default controller;
