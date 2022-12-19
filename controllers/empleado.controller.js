import empleadoM from "../models/empleado.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    const { departamento } = req.query;
    let response = await empleadoM.find(departamento);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(err.code).json(err);
  }
};

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await empleadoM.findOne(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(err.code).json(err);
  }
};

controller.insert = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, departamento } = req.body;

    const cuerpo = {
      nombre: mayusxPalabra(nombre),
      apellido_paterno: mayusxPalabra(apellidoPaterno),
      apellido_materno: mayusxPalabra(apellidoMaterno),
      iddepartamento: Number(departamento),
    };

    let response = await empleadoM.insert(cuerpo);
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
    const { id } = req.params;
    const { nombre, apellidoPaterno, apellidoMaterno, departamento } = req.body;

    const cuerpo = {
      nombre: mayusxPalabra(nombre),
      apellido_paterno: mayusxPalabra(apellidoPaterno),
      apellido_materno: mayusxPalabra(apellidoMaterno),
      iddepartamento: Number(departamento),
    };

    const data = [cuerpo, id];
    let response = await empleadoM.update(data);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(err.code).json(err);
  }
};

controller.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await empleadoM.delete(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(err.code).json(err);
  }
};

export default controller;
