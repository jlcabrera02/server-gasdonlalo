import salidaNoCM from "../models/salidaNoConforme.model";
import empleadoM from "../models/empleado.model";
import resErr from "../respuestas/error.respuestas";
const { errorMath } = resErr;

const controller = {};

controller.findSalidasNoConformesXMes = async (req, res) => {
  try {
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMes(fecha);
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

controller.findSalidasNoConformesXMesXIddepartamento = async (req, res) => {
  try {
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMesXIddepartamento(
      fecha,
      iddepartamento
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
    const { idSalida } = req.params;
    const response = await salidaNoCM.findOne(idSalida);
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
    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idEmpleadoAutoriza,
      idIncumplimiento,
    } = req.body;

    const cuerpo = {
      fecha,
      descripcion_falla: descripcionFalla,
      acciones_corregir: accionesCorregir,
      concesiones,
      idempleado: Number(idEmpleadoIncumple),
      idempleado_autoriza: Number(idEmpleadoAutoriza),
      idincumplimiento: Number(idIncumplimiento),
    };

    let response = await salidaNoCM.insert(cuerpo);
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
    const { idSalidaNoConforme } = req.params;
    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idEmpleadoAutoriza,
      idIncumplimiento,
      idDepartamento,
    } = req.body;

    let departamento = await empleadoM.validarDepartamento(idEmpleadoIncumple);
    if (departamento != idDepartamento)
      throw errorMath("El empleado no pertenece al departamento");

    const cuerpo = [
      {
        fecha,
        descripcion_falla: descripcionFalla,
        acciones_corregir: accionesCorregir,
        concesiones,
        idempleado: Number(idEmpleadoIncumple),
        idempleado_autoriza: Number(idEmpleadoAutoriza),
        idincumplimiento: Number(idIncumplimiento),
      },
      Number(idSalidaNoConforme),
    ];

    let response = await salidaNoCM.update(cuerpo);
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
    const { idSalidaNoConforme } = req.params;
    let response = await salidaNoCM.delete(idSalidaNoConforme);
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
