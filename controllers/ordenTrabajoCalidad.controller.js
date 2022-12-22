import ordenTrabajoCM from "../models/ordenTrabajoCalidad.model";
const controller = {};

controller.findOrdenTrabajoCalidadXEstacion = async (req, res) => {
  try {
    const { year, month, idEstacionServicio } = req.params;
    let fecha = `${year}-${month}-01`;

    const response = await ordenTrabajoCM.findOrdenTrabajoCalidadXEstacion(
      idEstacionServicio,
      fecha
    );
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

controller.findTotalOTXMesXEstacion = async (req, res) => {
  try {
    const { year, month, idEstacionServicio } = req.params;
    let fecha = `${year}-${month}-01`;

    const response = await ordenTrabajoCM.findTotalOTXMesXEstacion(
      idEstacionServicio,
      fecha
    );
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

controller.findTotaOTXMantenimiento = async (req, res) => {
  try {
    const { year, month, idEstacionServicio, idMantenimiento } = req.params;
    let fecha = `${year}-${month}-01`;

    const cuerpo = [idEstacionServicio, idMantenimiento, fecha, fecha];

    const response = await ordenTrabajoCM.findTotaOTXMantenimiento(cuerpo);
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
      tipoMantenimiento,
      fechaInicio,
      fechaTermino,
      descripcionFalla,
      idArea,
      idEstacionServicio,
      idEmpleadoSolicita,
    } = req.body;

    const cuerpo = {
      tipo_mantenimiento: tipoMantenimiento,
      fecha_inicio: fechaInicio,
      fecha_termino: fechaTermino,
      descripcion_falla: descripcionFalla,
      idarea: Number(idArea),
      idestacion_servicio: Number(idEstacionServicio),
      idempleado_solicita: Number(idEmpleadoSolicita),
    };

    let response = await ordenTrabajoCM.insert(cuerpo);
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
    const { idOTrabajoCalidad } = req.params;
    const {
      tipoMantenimiento,
      fechaInicio,
      fechaTermino,
      descripcionFalla,
      idArea,
      idEstacionServicio,
      idEmpleadoSolicita,
    } = req.body;

    const cuerpo = {
      tipo_mantenimiento: tipoMantenimiento,
      fecha_inicio: fechaInicio,
      fecha_termino: fechaTermino,
      descripcion_falla: descripcionFalla,
      idarea: Number(idArea),
      idestacion_servicio: Number(idEstacionServicio),
      idempleado_solicita: Number(idEmpleadoSolicita),
    };

    const data = [cuerpo, idOTrabajoCalidad];
    let response = await ordenTrabajoCM.update(data);
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
    const { idOTrabajoCalidad } = req.params;
    let response = await ordenTrabajoCM.delete(idOTrabajoCalidad);
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
