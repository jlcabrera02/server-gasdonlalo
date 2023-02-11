import generadorId from "../assets/generadorId";
import pasosDM from "../models/d.pasosDespachar.model";
import errRes from "../respuestas/error.respuestas";
import auth from "../models/auth.model";
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
