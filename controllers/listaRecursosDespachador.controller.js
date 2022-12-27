import listaReM from "../models/listaRecursosDespachador.model";

const controller = {};

controller.findListRecursosXmes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await listaReM.findListRecursosXmes(fecha);
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

controller.findListRecursosXmesXidEmpleado = async (req, res) => {
  try {
    const { year, month, id } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await listaReM.findListRecursosXmesXidEmpleado(id, fecha);
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

controller.findRecursos = async (req, res) => {
  try {
    const response = await listaReM.findRecursos();
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
    const { empleado, fecha, recursos } = req.body;

    const cuerpo = recursos.map((el) => [
      fecha,
      empleado,
      el.idRecurso,
      3,
      Number(el.evaluacion),
    ]);
    let response = await listaReM.insert(cuerpo);
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

controller.update = async (req, res) => {
  try {
    const { idRecurso } = req.params;
    const { evaluacion, empleado } = req.body;

    const cuerpo = [evaluacion, idRecurso, empleado];

    const response = await listaReM.update(cuerpo);
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

    let response = await listaReM.delete([
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
