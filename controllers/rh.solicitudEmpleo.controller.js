import seM from "../models/rh.solicitudEmpleo.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
const { verificar } = auth;
import resErr from "../respuestas/error.respuestas";

const controller = {};
const area = "Solicitudes de empleo y empleados";

const { peticionImposible, sinCambios } = resErr;

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
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

    if ((ns === 2 || ns === 1) && idDepartamento === 0) {
      throw peticionImposible(
        "Tienes que asignarle un departamento al empleado cuando es aceptado o en practica"
      );
    }

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

controller.updateMotivo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const { motivo } = req.body;

    const cuerpo = [{ motivo: motivo }, idEmpleado];

    const response = await seM.update(cuerpo);

    await guardarBitacora([
      "Solicitudes de empleo Motivos",
      user.token.data.datos.idempleado,
      3,
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

controller.changeDep = async (req, res) => {
  //Sirve para que se pueda hacer un cambio a un empleado de departamento.
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idDepartamento, idEmpleado } = req.body;

    const cuerpo = [{ idDepartamento }, idEmpleado];

    const response = await seM.update(cuerpo);

    await guardarBitacora([
      "Cambio de departamento a empleado",
      user.token.data.datos.idempleado,
      3,
      `e${idEmpleado} d${idDepartamento}`,
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

    await guardarBitacora([
      area,
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

export default controller;
