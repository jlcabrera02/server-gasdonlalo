import cmM from "../models/rh.madrugador.model";
import { guardarBitacora } from "../models/auditorias";
import empleadoM from "../models/rh.empleado.model";
import incModel from "../models/s.incumplimiento.model";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};
const area = "Concurso madrugador nuuevo departamento";

controller.findControlMadrugadorD = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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

controller.findDepartamentosByMadrugador = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const response = await cmM.findDepartamentosByMadrugador();
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month, iddepartamento } = req.params;
    // const fecha = `${year}-${month}-01`;
    const diasMes = new Date(year, month, 0).getDate();
    const empDesp = await empleadoM.findEmpleadosXmesXiddepartamento(
      iddepartamento
    );
    const puntosMes = await cmM.findPuntajeMes();
    const inc = await incModel.findByConcurso(iddepartamento);

    const response = [];

    for (let i = 0; i < empDesp.length; i++) {
      const data = [];
      const idEmpleado = empDesp[i].idempleado;
      for (let j = 1; j <= diasMes; j++) {
        const fecha = `${year}-${month}-${j}`;
        const columns = inc.map((el) => [
          el.idincumplimiento,
          el.incumplimiento,
          el.cantidad,
        ]);
        const puntos = {};
        for (let k = 0; k < columns.length; k++) {
          const total = await cmM.findSN([idEmpleado, fecha, columns[k][0]]);
          puntos[columns[k][1]] = total > 0 ? -columns[k][2] : 0;
        }
        /* let entradaSalida = await cmM.findTipoFalta([7, idEmpleado, fecha]);
        let retardo = await cmM.findTipoFalta([5, idEmpleado, fecha]);
        let falta = await cmM.findTipoFalta([4, idEmpleado, fecha]);
        let check = await cmM.findChecksBomba([idEmpleado, fecha]); */
        data.push({
          fecha,
          puntos,
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

    res
      .status(200)
      .json({ success: true, response: { data: response, columns: inc } });
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
    const { idDepartamento } = req.body;
    await cmM.validarNoDuplicados(idDepartamento);
    const response = await cmM.insertDepartamento(idDepartamento);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.insertId,
    ]);

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
