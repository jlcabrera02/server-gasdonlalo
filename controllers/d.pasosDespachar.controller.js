import generadorId from "../assets/generadorId";
import pasosDM from "../models/d.pasosDespachar.model";
import errRes from "../respuestas/error.respuestas";
import sncaM from "../models/s.acumular.model";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
const { tiempoDB } = formatTiempo;
const { verificar } = auth;
const { sinRegistro } = errRes;

const controller = {};

controller.findEvaluacionesXEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 14);
    if (!user.success) throw user;
    const { year, month, idEmpleado, quincena } = req.params;
    const fecha = `${year}-${month}-01`;
    const identificador = await pasosDM.agruparEvaluaciones([
      Number(idEmpleado),
      fecha,
    ]);
    const response = [];

    for (let i = 0; i < identificador.length; i++) {
      const pasos = await pasosDM.findEvaluacionesXEmpleado(
        identificador[i].identificador,
        Number(quincena)
      );
      if (pasos.length > 0) {
        let attach = {
          data: pasos,
          total: identificador[i].total,
          promedio: identificador[i].promedio,
          qna: identificador[i].quincena,
        };
        response.push(attach);
      }
    }

    if (response.length < 1) throw sinRegistro();

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findPasos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 14);
    if (!user.success) throw user;
    const response = await pasosDM.findPasos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findOne = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 14);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const response = await pasosDM.findOne(identificador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findEvaluacionesXTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 14);
    if (!user.success) throw user;
    const { fechaInicio, fechaFinal, idEmpleado } = req.body;
    const identificador = await pasosDM.agruparEvaluaciones([
      Number(idEmpleado),
      fechaInicio,
      fechaFinal,
    ]);
    const response = [];

    for (let i = 0; i < identificador.length; i++) {
      const pasos = await pasosDM.findEvaluacionesXEmpleado(
        identificador[i].identificador
      );
      if (pasos.length > 0) {
        response.push(pasos);
      }
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

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 14);
    if (!user.success) throw user;
    const { empleado, fecha, pasos } = req.body;
    const idGenerico = generadorId();

    let pasosGet = await pasosDM.findPasos();
    let insertPasos = pasosGet.map((el) => ({
      idPaso: el.idpaso_despachar,
      evaluacion: 0,
    }));

    pasos.forEach((el) => {
      let indexRemplazar = insertPasos.findIndex(
        (pa) => pa.idPaso === el.idPaso
      );
      insertPasos[indexRemplazar] = el;
    });

    const cuerpo = insertPasos.map((el) => [
      fecha,
      empleado,
      el.idPaso,
      el.evaluacion,
      idGenerico,
    ]);

    const incorrecto = cuerpo.map((el) => el[3]).includes(0);
    if (incorrecto) {
      await sncaM.insert([1, empleado, fecha, `No cumplio con algunos pasos`]);
    }

    //await pasosDM.verificar([cuerpo.fecha, cuerpo.idempleado]); //recoleccion efectivo
    let response = await pasosDM.insert(cuerpo);
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
    let user = verificar(req.headers.authorization, 15);
    if (!user.success) throw user;
    const { idEmpleado, evaluaciones } = req.body;

    const cuerpo = evaluaciones.map((el) => [
      el.evaluacion,
      el.idEvaluacionPaso,
      Number(idEmpleado),
    ]);

    const viejo = await pasosDM.findOneId(cuerpo[0][1]);
    const fecha = tiempoDB(viejo[0].fecha);
    const snca = await sncaM.validar([idEmpleado, 1, fecha]);
    const viejoGroup = await pasosDM.findOne(viejo[0].identificador);

    const incorrecto = cuerpo.map((el) => el[0]).includes(0);
    const viejoIncorrecto = viejoGroup
      .map((el) => el.evaluacion)
      .includes(false);

    if (!viejoIncorrecto && incorrecto) {
      await sncaM.insert([1, idEmpleado, fecha]);
    }

    if (snca.length > 0 && !incorrecto) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }

    let response = await pasosDM.update(cuerpo);
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
    let user = verificar(req.headers.authorization, 16);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const viejo = await pasosDM.findOne(identificador);
    const snca = await sncaM.validar([
      viejo[0].idempleado,
      1,
      tiempoDB(viejo[0].fecha),
    ]);
    if (snca.length > 0) {
      await sncaM.delete(snca[0].idsncacumuladas);
    }
    let response = await pasosDM.delete(identificador);
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
