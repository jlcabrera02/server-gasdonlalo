import seM from "../models/rh.solicitudEmpleo.model";
import empleadoM from "../models/rh.empleado.model";
import resErr from "../respuestas/error.respuestas";

const controller = {};

const { peticionImposible, sinCambios } = resErr;

controller.find = async (req, res) => {
  try {
    let response = await seM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXEstatus = async (req, res) => {
  try {
    const { estatus } = req.params;
    let response;
    if (Number(estatus) === 6) {
      response = await seM.findXTrabajando();
    } else {
      response = await seM.findXEstatus(Number(estatus));
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

controller.insert = async (req, res) => {
  try {
    const {
      idChecador,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      idDepartamento,
      estatus,
      edad,
      motivo,
    } = req.body;

    const ns = Number(estatus);
    if (ns === 3)
      throw peticionImposible(
        "No puedes despedir al empleado si no tiene datos existentes dentro de la empresa"
      );

    const cuerpo = {
      idchecador: idChecador || null,
      nombre: nombre.toLocaleUpperCase(),
      apellido_paterno: apellidoPaterno.toLocaleUpperCase(),
      apellido_materno: apellidoMaterno.toLocaleUpperCase(),
      iddepartamento: Number(idDepartamento),
      estatus: ns,
      edad: Number(edad) || null,
      motivo,
    };
    //Si la solicitud es pendiente o rechazada no nesesita de un idchecador
    if (ns === 5 || ns === 4) delete cuerpo.idchecador;

    if ((ns === 1 || ns === 2) && !idChecador)
      throw peticionImposible("Falta asignar un id");

    let response = await seM.insert(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateMotivo = async (req, res) => {
  try {
    const { idEmpleado } = req.params;
    const { motivo } = req.body;

    const cuerpo = [{ motivo: motivo }, idEmpleado];

    const response = await seM.update(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.changeDep = async (req, res) => {
  //Sirve para que se pueda hacer un cambio a un empleado de departamento.
  try {
    const { idDepartamento, idEmpleado } = req.body;

    const cuerpo = [{ idDepartamento }, idEmpleado];

    const response = await seM.update(cuerpo);

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
    const { idEmpleado } = req.params;
    const { estatus, idChecador, motivo } = req.body;
    const ns = Number(estatus);

    const cuerpo = {
      idchecador: idChecador,
      estatus: ns,
      motivo: motivo || null,
    };

    if (ns === 3 || ns === 4 || ns === 5) {
      cuerpo.idchecador = null;
    }
    if (ns === 1 || ns === 2) {
      if (!cuerpo.idchecador)
        throw peticionImposible("Falta asignar el idChecador");
    }

    const response = await seM.update([cuerpo, idEmpleado]);

    if (!response) throw sinCambios();

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
    let response = await seM.delete(id);
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
