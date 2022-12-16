import departamentoM from "../models/departamento.model";
import mayusxPalabra from "./formatearText.controller";

const controller = {};

controller.find = async (req, res) => {
  try {
    let departamentos = await departamentoM.find();
    console.log(departamentos);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

controller.insert = async (req, res) => {
  try {
    const departamento = mayusxPalabra(req.body.departamento);
    let departamentos = await departamentoM.insert(departamento);
    console.log(departamentos);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.update = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = mayusxPalabra(req.body.departamento);
    const data = [departamento, id];
    let departamentos = await departamentoM.update(data);
    console.log(departamentos);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

controller.delete = async (req, res) => {
  try {
    const { id } = req.params;
    let departamentos = await departamentoM.delete(id);
    console.log(departamentos);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export default controller;
