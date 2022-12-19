import recoleccionEM from "../models/recoleccionEfectivo.model";

const controller = {};

controller.findAllXMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const almacenar = [];

    for (let i = 1; i <= dias; i++) {
      let fecha = `${year}-${month}-${i}`;
      let response = await recoleccionEM.findAllXMonth(fecha);
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
    await recoleccionEM.verificar([cuerpo.fecha, cuerpo.idempleado]); //recoleccion efectivo
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
