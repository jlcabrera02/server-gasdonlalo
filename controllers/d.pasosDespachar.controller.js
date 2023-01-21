import generadorId from "../assets/generadorId";
import pasosDM from "../models/d.pasosDespachar.model";
import errRes from "../respuestas/error.respuestas";
const { sinRegistro } = errRes;

const controller = {};

controller.findEvaluacionesXEmpleado = async (req, res) => {
  try {
    const { year, month, idEmpleado, quincena } = req.params;
    const fecha = `${year}-${month}-01`;
    const identificador = await pasosDM.agruparEvaluaciones([
      Number(idEmpleado),
      fecha,
      fecha,
    ]);
    const response = [];

    for (let i = 0; i < identificador.length; i++) {
      const pasos = await pasosDM.findEvaluacionesXEmpleado(
        identificador[i].identificador,
        Number(quincena)
      );
      if (pasos.length > 0) {
        response.push(pasos);
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
    const response = await pasosDM.findPasos();
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

controller.insert = async (req, res) => {
  try {
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
    const { idEvaluacion } = req.params;
    const { evaluacion, empleado } = req.body;

    const cuerpo = [evaluacion, idEvaluacion, empleado];

    let response = await pasosDM.update(cuerpo);
    console.log(response);
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
    const { idEvaluacion, longitud, id } = req.params;
    const idSecond = Number(idEvaluacion) + Number(longitud);

    let response = await pasosDM.delete([
      Number(idEvaluacion),
      idSecond,
      Number(id),
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
