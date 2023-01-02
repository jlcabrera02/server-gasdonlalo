import generadorId from "../assets/generadorId";
import pasosDM from "../models/pasosDespachar.model";

const controller = {};

controller.findEvaluacionesXempleado = async (req, res) => {
  try {
    const { year, month, quincena, id } = req.params;
    const fecha = `${year}-${month}-01`;
    const pasos = await pasosDM.findCantidadEvaluacionesXempleado({
      id: id,
      fecha: fecha,
      quincena: Number(quincena),
    });

    let acumular = {
      idempleado: pasos[0].idempleado,
      nombre_completo: pasos[0].nombre_completo,
      status: pasos[0].status,
      evaluaciones: [],
    };

    for (let i = 0; i < pasos.length; i++) {
      const data = await pasosDM.findEvaluacionXempleado([
        id,
        pasos[i].create_time,
      ]);
      acumular.evaluaciones.push(data);
    }

    res.status(200).json({ success: true, response: acumular });
  } catch (err) {
    console.log(err);
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
