import cmM from "../models/rh.madrugador.model";
import empleadoM from "../models/rh.empleado.model";
const controller = {};

controller.findControlMadrugadorD = async (req, res) => {
  try {
    const { year, month, day, idEmpleado } = req.params;
    const fecha = `${year}-${month}-${day}`;
    let entradaSalida = await cmM.findTipoFalta([7, idEmpleado, fecha]);
    let retardo = await cmM.findTipoFalta([5, idEmpleado, fecha]);
    let falta = await cmM.findTipoFalta([4, idEmpleado, fecha]);
    let check = await cmM.findChecksBomba([idEmpleado, fecha]);

    const response = {
      entradaSalida: entradaSalida.total > 0 ? -10 : 0,
      retardo: retardo.total > 0 ? -20 : 0,
      falta: falta.total > 0 ? -20 : 0,
      check: check.total > 0 ? -20 : 0,
    };

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findControlMadrugadorM = async (req, res) => {
  try {
    const { year, month, idEmpleado } = req.params;
    const diasMes = new Date(year, month, 0).getDate();
    const response = [];
    for (let i = 1; i <= diasMes; i++) {
      const fecha = `${year}-${month}-${i}`;
      let entradaSalida = await cmM.findTipoFalta([7, idEmpleado, fecha]);
      let retardo = await cmM.findTipoFalta([5, idEmpleado, fecha]);
      let falta = await cmM.findTipoFalta([4, idEmpleado, fecha]);
      let check = await cmM.findChecksBomba([idEmpleado, fecha]);
      response.push({
        fecha,
        puntos: {
          entradaSalida: entradaSalida.total > 0 ? -10 : 0,
          retardo: retardo.total > 0 ? -20 : 0,
          check: check.total > 0 ? -30 : 0,
          falta: falta.total > 0 ? -40 : 0,
        },
      });
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

controller.findControlMadrugadorMG = async (req, res) => {
  try {
    const { year, month } = req.params;
    const fecha = `${year}-${month}-01`;
    const diasMes = new Date(year, month, 0).getDate();
    const empDesp = await empleadoM.findEmpleadosXmesXiddepartamento([
      1,
      fecha,
    ]);
    const puntosMes = await cmM.findPuntajeMes();

    const response = [];

    for (let i = 0; i < empDesp.length; i++) {
      const data = [];
      const idEmpleado = empDesp[i].idempleado;
      for (let j = 1; j <= diasMes; j++) {
        const fecha = `${year}-${month}-${j}`;
        let entradaSalida = await cmM.findTipoFalta([7, idEmpleado, fecha]);
        let retardo = await cmM.findTipoFalta([5, idEmpleado, fecha]);
        let falta = await cmM.findTipoFalta([4, idEmpleado, fecha]);
        let check = await cmM.findChecksBomba([idEmpleado, fecha]);
        data.push({
          fecha,
          puntos: {
            entradaSalida: entradaSalida.total > 0 ? -10 : 0,
            retardo: retardo.total > 0 ? -20 : 0,
            check: check.total > 0 ? -30 : 0,
            falta: falta.total > 0 ? -40 : 0,
          },
        });
      }
      let puntosPerdidos = Math.abs(
        data
          .map((el) => Object.values(el.puntos).reduce((a, b) => a + b))
          .reduce((a, b) => a + b)
      );
      response.push({
        empleado: empDesp[i],
        puntosMes,
        puntosPerdidos,
        puntosRestantes: puntosMes - puntosPerdidos,
        fechas: data,
      });
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

export default controller;