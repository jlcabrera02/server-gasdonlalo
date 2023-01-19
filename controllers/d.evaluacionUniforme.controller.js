import evaluacionUniformeM from "../models/d.evaluacionUniforme.model";
import generadorId from "../assets/generadorId";
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

controller.findPasosEvUniforme = async (req, res) => {
  try {
    let response = await evaluacionUniformeM.findPasosEvUniforme();
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
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    const cuerpo = [fecha, idEmpleado];
    const response = [];
    let quin1 = await evaluacionUniformeM.findPeriodoMensualEmpleadosXquincena([
      ...cuerpo,
      1,
    ]);
    let quin2 = await evaluacionUniformeM.findPeriodoMensualEmpleadosXquincena([
      ...cuerpo,
      2,
    ]);
    if (quin1.length > 0) {
      response.push({
        fecha: quin1[0].fecha,
        evaluaciones: quin1,
      });
    } else {
      response.push({
        fecha: null,
        evaluaciones: [],
      });
    }
    if (quin2.length > 0) {
      response.push({
        fecha: quin2[0].fecha,
        evaluaciones: quin2,
      });
    } else {
      response.push({
        fecha: null,
        evaluaciones: [],
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

controller.findOne = async (req, res) => {
  try {
    const { identificador } = req.params;
    const response = await evaluacionUniformeM.findOne(identificador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXTiempo = async (req, res) => {
  try {
    const { idEmpleado } = req.body;
    const cuerpo = [Number(idEmpleado)];
    const response = await evaluacionUniformeM.findXTiempo(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    const { empleado, fecha, evaluaciones } = req.body;
    const idGenerico = generadorId();
    const cuerpo = evaluaciones.map((el) => [
      fecha,
      Number(empleado),
      Number(el.idCumplimiento),
      2,
      Number(el.cumple),
      idGenerico,
    ]);
    console.log(cuerpo);
    await evaluacionUniformeM.validarNoDuplicadoXQuincena(req.body); //validamos si existe un registro
    let response = await evaluacionUniformeM.insert(cuerpo);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
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
    const { identificador } = req.params;
    let response = await evaluacionUniformeM.delete(identificador);
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
