import empleadoM from "../models/rh.empleado.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
const { verificar } = auth;
import { mayus } from "./formatearText.controller";

const controller = {};
const area = "Empleados";

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { departamento } = req.query;
    let response = await empleadoM.find(departamento);
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
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { id } = req.params;
    let response = await empleadoM.findOne(id);
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { nombre, apellidoPaterno, apellidoMaterno, departamento } = req.body;

    const cuerpo = {
      nombre: mayus(nombre),
      apellido_paterno: mayus(apellidoPaterno),
      apellido_materno: mayus(apellidoMaterno),
      iddepartamento: Number(departamento),
    };

    let response = await empleadoM.insert(cuerpo);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.insertId,
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

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const empleadoById = await empleadoM.findOne(idEmpleado);

    const {
      nombre,
      idchecador,
      apellido_paterno,
      apellido_materno,
      iddepartamento,
      estatus,
      edad,
      motivo,
    } = empleadoById[0];

    const cuerpo = {
      idchecador: req.body.idChecador || idchecador,
      nombre: mayus(req.body.nombre || nombre),
      apellido_paterno: mayus(req.body.apellidoPaterno || apellido_paterno),
      apellido_materno: mayus(req.body.apellidoMaterno || apellido_materno),
      iddepartamento: req.body.idDepartamento || iddepartamento,
      estatus: req.body.estatus || estatus,
      edad: req.body.edad || edad,
      motivo: req.body.motivo || motivo,
    };

    const response = await empleadoM.update(cuerpo, idEmpleado);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      idEmpleado,
    ]);

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

controller.updateFechaRegistro = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const { fecha } = req.body;

    const cuerpo = { fecha_registro: fecha };

    const response = await empleadoM.update(cuerpo, idEmpleado);

    await guardarBitacora([
      "Fecha Registro Empleado",
      user.token.data.datos.idempleado,
      3,
      idEmpleado,
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

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { id } = req.params;
    let response = await empleadoM.delete(id);

    await guardarBitacora([area, user.token.data.datos.idempleado, 4, id]);

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
