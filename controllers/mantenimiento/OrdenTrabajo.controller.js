import modelos from "../../models";
import auth from "../../models/auth.model";
import sequelize from "../../config/configdb";
import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../../services/configuracionesPersonalizables";
import format from "../../assets/formatTiempo";
import Decimal from "decimal.js-light";
import Utencilios from "../../models/mantenimiento/Utencilios";
import { Op } from "sequelize";
import { attributesPersonal } from "../../models/recursosHumanos/empleados.model";
const { verificar } = auth;
const { OT, PanicBtn, empleados, AT, SncNotification } = modelos;

const controller = {};

controller.configurarPrecio = (req, res) => {
  const { precioOT } = req.body;
  const precio = typeof precioOT === "number" ? precioOT : 0;
  escribirConfiguraciones({ precioHoraOT: precio });

  return res.status(200).json({
    success: true,
    response: { precioHoraOT: obtenerConfiguraciones().precioHoraOT },
  });
};

controller.precioOT = (req, res) => {
  const response = obtenerConfiguraciones().precioHoraOT;

  return res.status(200).json({
    success: true,
    response: { precioHoraOT: response },
  });
};

controller.obtenerUtencilios = async (req, res) => {
  try {
    const response = await Utencilios.findAll();

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.editarUtencilios = async (req, res) => {
  try {
    const { idutencilio } = req.params;
    const { utencilio, costo, medida, tipoHerramienta } = req.body;

    const response = await Utencilios.update(
      { utencilio, costo, medida, tipo_utencilio: tipoHerramienta },
      { where: { idutencilio } }
    );

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.crearUtencilios = async (req, res) => {
  try {
    const { utencilio, costo, medida, tipoHerramienta } = req.body;

    const response = await Utencilios.create({
      utencilio,
      costo,
      tipo_utencilio: tipoHerramienta,
      medida: medida,
    });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.eliminarUtencilios = async (req, res) => {
  try {
    const { idutencilio } = req.params;
    const response = await Utencilios.destroy({ where: { idutencilio } });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.crearOTFromPanicBtn = async (req, res) => {
  try {
    // let user = verificar(req.headers.authorization);
    // if (!user.success) throw user;
    const { idPanicBtn, fechaInicio, descripcionFalla, idEstacionServicio } =
      req.body;

    const response = await sequelize.transaction(async (t) => {
      const createOT = await OT.create(
        {
          tipo_mantenimiento: 1,
          fecha_inicio: fechaInicio,
          descripcion_falla: descripcionFalla,
          idarea: 1,
          idestacion_servicio: idEstacionServicio,
        },
        { transaction: t }
      );

      await PanicBtn.update(
        { ot: true },
        { where: { idpanic_btn: idPanicBtn }, transaction: t }
      );

      return createOT;
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.crearOTSolicitud = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { tipoMantenimiento, descripcionFalla, idArea, idEstacionServicio } =
      req.body;

    const response = await OT.create({
      idsolicitante: user.token.data.datos.idempleado,
      tipo_mantenimiento: tipoMantenimiento,
      idarea: idArea,
      idestacion_servicio: idEstacionServicio,
      descripcion_falla: descripcionFalla,
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.crearOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const {
      fechaInicio,
      fechaTermino,
      tipoMantenimiento,
      descripcionFalla,
      descripcionTrabajo,
      observaciones,
      herramientas,
      idPersonal,
      tipoPersonal,
      idArea,
      personalExterno,
      idEstacionServicio,
    } = req.body;

    const totalTiempo =
      new Date(fechaTermino).getTime() - new Date(fechaInicio).getTime();

    const trasformHours = new Decimal(totalTiempo)
      .div(new Decimal(60000 * 60))
      .toFixed(2);

    const totalCostoHora = new Decimal(obtenerConfiguraciones().precioHoraOT)
      .mul(new Decimal(trasformHours))
      .toFixed(2);

    const costoHerramientas = herramientas
      .map((el) => el.costo)
      .reduce((a, b) => new Decimal(a).add(new Decimal(b).toFixed(2)), 0);

    const totalGeneral = new Decimal(totalCostoHora)
      .add(new Decimal(costoHerramientas))
      .toFixed(2);

    const detallesCosto = {
      horasAcumuladas: trasformHours,
      pagoHora: totalCostoHora,
      precioHora: obtenerConfiguraciones().precioHoraOT,
      costoHerramientaEinsumos: costoHerramientas,
      costoGeneral: totalGeneral,
    };

    const response = await OT.create({
      idsolicitante: user.token.data.datos.idempleado,
      tipo_mantenimiento: tipoMantenimiento,
      fecha_inicio: fechaInicio,
      fecha_termino: fechaTermino,
      idarea: idArea,
      estatus: 3,
      idestacion_servicio: idEstacionServicio,
      descripcion_falla: descripcionFalla,
      descripcion_trabajo: descripcionTrabajo,
      observaciones: observaciones,
      idpersonal: idPersonal,
      tipo_personal: tipoPersonal,
      idliberante: user.token.data.datos.idempleado,
      herramientas: herramientas,
      detalles_costo: detallesCosto,
      personal_externo: personalExterno,
    });

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

controller.obtenerOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const {
      estatus,
      fechaInicio,
      fechaTermino,
      month,
      year,
      ES,
      idPersonal,
      idArea,
      TM,
    } = req.query;
    const query = { estatus: 4 };
    const queryAreaT = {};

    if (estatus === "terminadas") {
      query.estatus = 3;
    }
    if (estatus === "liberadas") {
      query.estatus = 4;
    }
    if (estatus === "solicitudes") {
      query.estatus = 1;
    }
    if (estatus === "realizando") {
      query.estatus = 2;
    }
    if (estatus === "todo") {
      delete query.estatus;
    }

    if (fechaInicio && fechaTermino) {
      query.fecha_inicio = { [Op.between]: [fechaInicio, fechaTermino] };
    }

    if (month && year) {
      query[Op.and] = [
        sequelize.where(
          sequelize.fn("MONTH", sequelize.col("fecha_inicio")),
          month
        ),
        sequelize.where(
          sequelize.fn("year", sequelize.col("fecha_inicio")),
          year
        ),
      ];
    }

    if (ES) {
      query["idestacion_servicio"] = ES;
    }

    if (idPersonal) {
      query["idpersonal"] = idPersonal;
    }

    if (idArea) {
      query["idarea"] = idArea;
    }

    if (TM) {
      query["tipo_mantenimiento"] = TM;
    }

    const response = await OT.findAll({
      attributes: req.query.isReport
        ? [
            "idorden_trabajo",
            "estatus",
            "detalles_costo",
            "herramientas",
            "tipo_mantenimiento",
            "tipo_personal",
            "fecha_inicio",
          ]
        : false,
      where: query,
      include: req.query.isReport
        ? [
            { model: AT, where: queryAreaT },
            {
              model: empleados,
              as: "personal",
              attributes: ["nombre", "apellido_paterno", "apellido_materno"],
            },
            {
              model: empleados,
              as: "liberante",
              attributes: ["nombre", "apellido_paterno", "apellido_materno"],
            },
            {
              model: empleados,
              as: "solicitante",
              attributes: ["nombre", "apellido_paterno", "apellido_materno"],
            },
          ]
        : [
            { model: empleados, as: "personal" },
            { model: empleados, as: "liberante" },
            { model: empleados, as: "solicitante" },
            { model: AT },
          ],
    });
    const costoHora = obtenerConfiguraciones().precioHoraOT;

    res.status(200).json({ success: true, costoHora, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.realizarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let idPersonal = user.token.data.datos.idempleado;
    const { idOT } = req.params;

    const response = await OT.update(
      {
        idpersonal: idPersonal,
        fecha_inicio: format.tiempoDBComplete(new Date()),
        estatus: 2,
      },
      { where: { idorden_trabajo: idOT } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.terminarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let idPersonal = user.token.data.datos.idempleado;
    const { idOT } = req.params;
    const {
      tipoPersonal,
      descripcionTrabajo,
      herramientas,
      observaciones,
      fechaInicio,
    } = req.body;

    console.log(req.body);

    const ot = await OT.findOne({ where: { idorden_trabajo: idOT } });

    const isFechaTermino = req.body.fechaTermino;

    if (!ot)
      throw {
        success: false,
        code: 400,
        msg: "No se encontro el elemento en la Base de datos",
      };

    if (tipoPersonal === 2) {
      idPersonal = null;
    }

    const fechaTermino = isFechaTermino
      ? format.tiempoDBComplete(isFechaTermino)
      : format.tiempoDBComplete(Date.now());

    const totalTiempo =
      new Date(fechaTermino).getTime() -
      new Date(fechaInicio || ot.dataValues.fecha_inicio).getTime();

    const trasformHours = new Decimal(totalTiempo)
      .div(new Decimal(60000 * 60))
      .toFixed(2);

    const totalCostoHora = new Decimal(obtenerConfiguraciones().precioHoraOT)
      .mul(new Decimal(trasformHours))
      .toFixed(2);

    const costoHerramientas = herramientas
      .map((el) => el.costo)
      .reduce((a, b) => new Decimal(a).add(new Decimal(b).toFixed(2)), 0);

    const totalGeneral = new Decimal(totalCostoHora)
      .add(new Decimal(costoHerramientas))
      .toFixed(2);

    const detallesCosto = {
      horasAcumuladas: trasformHours,
      pagoHora: totalCostoHora,
      precioHora: obtenerConfiguraciones().precioHoraOT,
      costoHerramientaEinsumos: costoHerramientas,
      costoGeneral: totalGeneral,
    };

    const response = await OT.update(
      {
        tipo_personal: tipoPersonal,
        fecha_termino: fechaTermino,
        descripcion_trabajo: descripcionTrabajo,
        herramientas,
        observaciones,
        estatus: 3,
        idpersonal: idPersonal,
        detalles_costo: detallesCosto,
      },
      { where: { idorden_trabajo: idOT } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.liberarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let idPersonal = user.token.data.datos.idempleado;

    const fecha = format.tiempoDB(Date.now(), true);
    const { idOT } = req.params;
    const { procedio, descripcion } = req.body;

    const ot = await OT.findOne({ where: { idorden_trabajo: idOT } });

    if (!ot)
      throw {
        success: false,
        code: 400,
        msg: "No se encontro una orden de trabajo",
      };

    const response = sequelize.transaction(async (t) => {
      if (!procedio) {
        const cuerpo = { ...ot.dataValues, estatus: 2 };
        //eliminar attributos que no se necesitan para crear una nueva OT
        delete cuerpo.idorden_trabajo;
        delete cuerpo.descripcion;
        delete cuerpo.createdAt;
        delete cuerpo.updatedAt;

        await OT.update(
          { estatus: 5, descripcion },
          { where: { idorden_trabajo: idOT }, transaction: t }
        );

        const createOT = await OT.create(cuerpo, { transaction: t });

        return createOT;
      } else {
        const response = await OT.update(
          {
            estatus: 4,
            idliberante: idPersonal,
          },
          { where: { idorden_trabajo: idOT } }
        );
        return response;
      }
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.eliminarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idOT } = req.params;

    const response = await OT.update(
      { estatus: "eliminado" },
      { where: { idorden_trabajo: idOT } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.cancelarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idOT } = req.params;

    const ot = await OT.update(
      { estatus: 1, fecha_termino: null, idPersonal: null },
      { where: { idorden_trabajo: idOT } }
    );

    res.status(200).json({ success: true, response: ot });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.historialOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const filtrosOT = { estatus: ["liberado", "cancelado"] };
    const { resultado, fechaI, fechaF, idEmpleado, offset, limit } = req.query;

    if (resultado) {
      filtrosOT.resultado = resultado;
    }

    if (fechaI && fechaF) {
      filtrosOT.fecha_inicio = { [Op.between]: [fechaI, fechaF] };
    }

    if (idEmpleado) {
      filtrosOT.idpersonal = idEmpleado;
    }

    const response = await OT.findAndCountAll({
      where: filtrosOT,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: empleados,
          as: "personal",
          attributes: [
            "nombre",
            "apellido_paterno",
            "apellido_materno",
            "nombre_completo",
          ],
        },
        {
          model: empleados,
          attributes: attributesPersonal,
          as: "empleado_autorizador",
        },
        { model: AT },
      ],
      offset: offset ? Number(offset) : null,
      limit: limit ? Number(limit) || 10 : null,
    });

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

export default controller;
