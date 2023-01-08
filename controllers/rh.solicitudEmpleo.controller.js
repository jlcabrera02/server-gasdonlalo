import seM from "../models/rh.solicitudEmpleo.model";
import empleadoM from "../models/empleado.model";
import resErr from "../respuestas/error.respuestas";

const controller = {};

const { peticionImposible, sinCambios } = resErr;

controller.find = async (req, res) => {
  try {
    let response = await seM.find();
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

controller.findXEstatus = async (req, res) => {
  try {
    const { estatus } = req.params;
    let response = await seM.findXEstatus(Number(estatus));
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
    const {
      idEmpleado,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      idDepartamento,
      estatus,
      fechaNacimiento,
      motivo,
    } = req.body;

    const ns = Number(estatus);
    if (ns === 3)
      throw peticionImposible(
        "No puedes despedir al empleado si no tiene datos existentes dentro de la empresa"
      );
    if (ns === 4)
      throw peticionImposible(
        "Para rechazar una solicitud primero debes añadirla"
      );

    const cuerpo = {
      idempleado: idEmpleado || null,
      nombre: nombre.toLocaleUpperCase(),
      apellido_paterno: apellidoPaterno.toLocaleUpperCase(),
      apellido_materno: apellidoMaterno.toLocaleUpperCase(),
      iddepartamento: Number(idDepartamento),
      estatus: ns,
      fecha_nacimiento: fechaNacimiento,
      motivo,
    };
    //Si la soliciitud es pendiente no nesesita de un id
    if (ns === 5) delete cuerpo.idempleado;

    if ((ns === 1 || ns === 2) && !idEmpleado)
      throw peticionImposible("Falta asignar un id");

    if (ns === 1 || ns === 2) {
      const empData = {
        idempleado: Number(idEmpleado),
        nombre: nombre.toLocaleUpperCase(),
        apellido_paterno: apellidoPaterno.toLocaleUpperCase(),
        apellido_materno: apellidoMaterno.toLocaleUpperCase(),
        iddepartamento: idDepartamento,
        estatus: ns,
      };
      await empleadoM.insert(empData);
    }

    let response = await seM.insert(cuerpo);

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

controller.update = async (req, res) => {
  try {
    const { idSolicitud } = req.params;
    const { estatus, idEmpleado, motivo } = req.body;
    const ns = Number(estatus);

    if (ns === 5) throw peticionImposible("No disponible");

    const solicitud = await seM.findSolicitud(idSolicitud);
    console.log({ solicitud });

    const empData = {
      idempleado: solicitud.idempleado ? solicitud.idempleado : idEmpleado,
      nombre: solicitud.nombre.toLocaleUpperCase(),
      apellido_paterno: solicitud.apellido_paterno.toLocaleUpperCase(),
      apellido_materno: solicitud.apellido_materno.toLocaleUpperCase(),
      iddepartamento: solicitud.iddepartamento,
      estatus: ns,
    };

    let response;

    if (solicitud.estatus === "Pendiente" && (ns === 1 || ns === 2)) {
      await empleadoM.insert(empData);
      response = await seM.update([
        { estatus: ns, idEmpleado: idEmpleado, motivo: motivo || null },
        idSolicitud,
      ]);
    }
    if (solicitud.estatus === "Practica" && ns === 1) {
      await empleadoM.update([empData, solicitud.idempleado]);
      response = await seM.update([
        { estatus: ns, motivo: motivo || null },
        idSolicitud,
      ]);
    }
    if (
      (solicitud.estatus === "Contrato" || solicitud.estatus === "Practica") &&
      ns === 3
    ) {
      await empleadoM.delete(solicitud.idempleado);
      response = await seM.update([
        { estatus: ns, motivo: motivo || null },
        idSolicitud,
      ]);
    }
    if (solicitud.estatus === "Pendiente" && ns === 4) {
      response = await seM.update([
        { estatus: ns, motivo: motivo || null },
        idSolicitud,
      ]);
    }

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
