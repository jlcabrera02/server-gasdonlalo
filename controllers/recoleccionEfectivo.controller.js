import recoleccionEM from "../models/recoleccionEfectivo.model";

const controller = {};

controller.findEmpleadosXMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const almacenar = [];

    const empleados = await recoleccionEM.findEmpleadosXMonth(fecha);
    for (let i = 0; i < empleados.length; i++) {
      const alm = [];
      for (let j = 1; j <= dias; j++) {
        let fechaB = `${year}-${month}-${j}`;
        let cuerpo = [fechaB, empleados[i].idempleado];
        let response = await recoleccionEM.findEmpleadosXFecha(cuerpo);
        alm.push({
          total_cantidad: null,
          fecha: null,
          ...response,
          fechaGenerada: fechaB,
        });
      }
      almacenar.push({
        empleado: empleados[i],
        dataFecha: alm,
      });
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

controller.findAllRegistersXMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    let fecha = `${year}-${month}-01`;
    let response = await recoleccionEM.findAllRegistersXMonth(fecha);
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

controller.findAllRegistersXMonthXEmpleado = async (req, res) => {
  try {
    const { year, month, id } = req.params;

    let fecha = `${year}-${month}-01`;
    let response = await recoleccionEM.findAllRegistersXMonthXEmpleado(
      fecha,
      id
    );
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
    let response = await recoleccionEM.findOne(id);
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
    const { fecha, empleado, cantidad } = req.body;

    const cuerpo = {
      fecha,
      idempleado: Number(empleado),
      cantidad,
    };
    //await recoleccionEM.verificar([cuerpo.fecha, cuerpo.idempleado]); //recoleccion efectivo
    let response = await recoleccionEM.insert(cuerpo);
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
    let response = await recoleccionEM.update(data);
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
    let response = await recoleccionEM.delete(id);
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
