import evaluacionUniformeM from "../models/evaluacionUniforme.model";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await evaluacionUniformeM.find();
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

controller.findPeriodoMensual = async (req, res) => {
  try {
    const { year, month } = req.params;
    const fecha = `${year}-${month}-01`;
    let response = await evaluacionUniformeM.findPeriodoMensual(fecha);
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

controller.findPeriodoMensualEmpleado = async (req, res) => {
  try {
    const { year, month, id } = req.params;
    const fecha = `${year}-${month}-01`;
    const cuerpo = [id, fecha, fecha];
    let response = await evaluacionUniformeM.findPeriodoMensualEmpleado(cuerpo);
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

controller.findPeriodoMensualEmpleados = async (req, res) => {
  try {
    const { year, month, id } = req.params;
    const fecha = `${year}-${month}-01`;
    let response = await evaluacionUniformeM.findPeriodoMensualEmpleados(fecha);
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

controller.findOne = async (req, res) => {
  try {
    const { id, fecha } = req.params;
    const cuerpo = [id, fecha];
    let response = await evaluacionUniformeM.findOne(cuerpo);
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

controller.insert = async (req, res) => {
  try {
    const { empleado, fecha, evaluaciones } = req.body;
    const cuerpo = {
      empleado: Number(empleado),
      fecha,
      evaluaciones,
    };
    let a = await evaluacionUniformeM.validarNoDuplicadoXQuincena(req.body); //validamos si existe un registro
    console.log(a);
    let response = await evaluacionUniformeM.insert(cuerpo);
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
    const { empleado, evaluaciones } = req.body;
    const cuerpo = evaluaciones.map((el) => [
      el.cumple,
      el.idEvaluacionUniforme,
      empleado,
    ]);
    let response = await evaluacionUniformeM.update(cuerpo);
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
    const { empleado, fecha } = req.body;
    const cuerpo = [empleado, fecha];
    let response = await evaluacionUniformeM.delete(cuerpo);
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

export default controller;
