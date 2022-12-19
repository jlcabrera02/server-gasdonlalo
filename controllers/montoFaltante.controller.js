import montoFaltanteM from "../models/montoFaltante.model";
import empleadoM from "../models/empleado.model";
import resErr from "../respuestas/error.respuestas";
const { errorMath } = resErr;

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await montoFaltanteM.find();
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

controller.findXSemana = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findXSemana(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findCantidadXMes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findCantidadXMes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXMesXEmpleado = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    let response = await montoFaltanteM.findXMesXEmpleado(fecha);
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

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await montoFaltanteM.findOne(id);
    console.log(response);
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
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      idempleado: Number(empleado),
    };
    let buscar = await empleadoM.findOne(empleado);
    if (buscar[0].iddepartamento != 1)
      throw errorMath(
        "El empleado no pertenece al departamento de despachadores"
      );
    let response = await montoFaltanteM.insert(cuerpo);
    console.log(response);
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

controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, fecha, empleado } = req.body;
    const cuerpo = {
      cantidad: Number(cantidad),
      fecha,
      idempleado: Number(empleado),
    };
    const data = [cuerpo, id];
    let response = await montoFaltanteM.update(data);
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
    const { id } = req.params;
    let response = await montoFaltanteM.delete(id);
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
