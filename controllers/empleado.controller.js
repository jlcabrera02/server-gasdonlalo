import empleadoM from "../models/empleado.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let response = await empleadoM.find();
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await empleadoM.findOne(id);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, departamento } = req.body;

    const cuerpo = {
      nombre: mayusxPalabra(nombre),
      apellido_paterno: mayusxPalabra(apellidoPaterno),
      apellido_materno: mayusxPalabra(apellidoMaterno),
      departamento: Number(departamento),
    };

    let response = await empleadoM.insert(cuerpo);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
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
      departamento: Number(departamento),
    };

    const data = [cuerpo, id];
    let response = await empleadoM.update(data);
    console.log(response);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
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
    res.status(400).json({ success: false });
  }
};

export default controller;
