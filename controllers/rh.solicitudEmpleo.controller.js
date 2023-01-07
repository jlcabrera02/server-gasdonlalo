import seM from "../models/rh.solicitudEmpleo.model";
import empleadoM from "../models/empleado.model";
import resErr from "../respuestas/error.respuestas";

const controller = {};

const { peticionImposible } = resErr;

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

    if ((ns === 1 || ns === 2) && !idEmpleado)
      throw peticionImposible("Falta asignar un id");
    if (!idEmpleado && (ns != 1 || ns != 2)) delete cuerpo.idempleado;
    if (!motivo) delete cuerpo.motivo;

    if (ns === 1 || ns === 2) {
      const empData = {
        idempleado: Number(idEmpleado),
        nombre: nombre.toLocaleUpperCase(),
        apellido_paterno: apellidoPaterno.toLocaleUpperCase(),
        apellido_materno: apellidoMaterno.toLocaleUpperCase(),
        iddepartamento: idDepartamento,
        estatus: ns,
      };
      if (!idEmpleado) throw peticionImposible("Asigna un id al empleado");
      console.log("Adssad");
      await empleadoM.insert(empData);
    }
    if (ns === 3)
      throw peticionImposible(
        "No puedes despedir al empleado si no tiene datos existentes dentro de la empresa"
      );

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

    const solicitud = await seM.findSolicitud(idSolicitud);
    console.log({ solicitud });

    if (estatus === 1 || estatus === 2) {
      const empData = {
        idempleado: solicitud.idempleado ? solicitud.idempleado : idEmpleado,
        nombre: solicitud.nombre.toLocaleUpperCase(),
        apellido_paterno: solicitud.apellido_paterno.toLocaleUpperCase(),
        apellido_materno: solicitud.apellido_materno.toLocaleUpperCase(),
        iddepartamento: solicitud.iddepartamento,
        estatus,
      };
      if (solicitud.estatus === "Practica" && estatus === 1) {
        await empleadoM.update([empData, solicitud.idempleado]);
      } else {
        await empleadoM.insert(empData);
      }
    } else if (estatus === 3) {
      try {
        await empleadoM.findOne(solicitud.idempleado);
        const despedir = await empleadoM.delete(solicitud.idempleado);
        console.log({ despedir });
      } catch (err) {
        throw peticionImposible(
          "No puedes despedir si todavia no esta trabajando el empleado"
        );
      }
    } else if (estatus === 4) {
      if (solicitud.estatus != "Pendiente" && solicitud.estatus != "Pendiente")
        throw peticionImposible(
          "Solo puedes rechazar la solicitud cuando este pendiente o rechazandola en el momento"
        );
    }

    const cuerpo = [
      {
        ...solicitud,
        idempleado: solicitud.idempleado ? solicitud.idempleado : idEmpleado,
        estatus: Number(estatus),
        motivo,
      },
      idSolicitud,
    ];
    //Lo elimino porque de todas las formas ya no se necesita el id
    delete cuerpo.idsolicitud_empleo;

    let response = await seM.update(cuerpo);
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
