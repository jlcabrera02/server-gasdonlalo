import pasosDM from "../models/pasosDespachar.model";
import mysql from "mysql2";

const controller = {};

controller.findAllXMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const almacenar = [];

    for (let i = 1; i <= dias; i++) {
      let fecha = `${year}-${month}-${i}`;
      let response = await pasosDM.findAllXMonth(fecha);
      response = response.map((el) => ({
        ...el,
        fechaGenerada: fecha,
      }));
      almacenar.push({ fecha, data: [...response] });
    }

    res.status(200).json({ success: true, response: almacenar });
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

    const cuerpo = pasos.map((el) => [
      null,
      fecha,
      empleado,
      el.id,
      el.evaluacion,
      mysql.raw("CURRENT_TIMESTAMP()"),
    ]);
    //await pasosDM.verificar([cuerpo.fecha, cuerpo.idempleado]); //recoleccion efectivo
    let response = await pasosDM.insert(cuerpo);
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
    const { cantidad } = req.body;

    const cuerpo = {
      id,
      cantidad: Number(cantidad),
    };

    const data = [cuerpo.cantidad, cuerpo.id];
    let response = await pasosDM.update(data);
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
    let response = await pasosDM.delete(id);
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
