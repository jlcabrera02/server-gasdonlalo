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
const { OT, PanicBtn, empleados, AT, SncNotification, HOT } = modelos;

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
    const { tipoPersonal, descripcionTrabajo, herramientas, observaciones } =
      req.body;

    const ot = await OT.findOne({ where: { idorden_trabajo: idOT } });

    const isFechaTermino = ot.dataValues.fecha_termino;

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
      new Date(ot.dataValues.fecha_inicio).getTime();

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
      await HOT.create(
        {
          resultado: procedio ? "AUTORIZADO" : "NO-AUTORIZADO",
          descripcion,
          idautorizante: user.token.data.datos.idempleado,
          idorden_trabajo: idOT,
        },
        { transaction: t }
      );

      if (procedio) {
        const response = await OT.update(
          {
            estatus: 4,
            idliberante: idPersonal,
          },
          { where: { idorden_trabajo: idOT } }
        );
        return response;
      } else {
        const response = await OT.update(
          {
            estatus: 2,
            idliberante: idPersonal,
          },
          { where: { idorden_trabajo: idOT } }
        );

        if (ot.dataValues.idpersonal) {
          const sncNotificationFind =
            obtenerConfiguraciones().configSNC.sncacumuladas.find(
              (el) => el.notificacion === "Órden de trabajo no autorizada"
            );

          const empleadoName = await empleados.findOne({
            attributes: [
              "nombre",
              "apellido_paterno",
              "apellido_materno",
              "nombre_completo",
            ],
            where: { idempleado: ot.dataValues.idpersonal },
          });

          const descripcion = sncNotificationFind.descripcion
            .replaceAll(
              `\$\{empleado\}`,
              JSON.parse(
                JSON.stringify(empleadoName)
              ).nombre_completo.toLowerCase()
            )
            .replaceAll(`\$\{fecha\}`, format.tiempoLocalShort(fecha));

          await SncNotification.create(
            {
              idincumplimiento: sncNotificationFind.idincumplimiento,
              descripcion: descripcion,
              idempleado: ot.dataValues.idpersonal,
              fecha: fecha,
            },
            { transaction: t }
          );
        }
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

controller.cancelarOT = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idOT } = req.params;

    const ot = await OT.update(
      { estatus: 1, fechaInicio: null, fechaTermino: null, idPersonal: null },
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
    const filtros = {};
    const filtrosOT = {};
    const { resultado, fechaI, fechaF, idEmpleado, offset, limit } = req.query;

    if (resultado) {
      filtros.resultado = resultado;
    }

    if (fechaI && fechaF) {
      filtrosOT.fecha_inicio = { [Op.between]: [fechaI, fechaF] };
    }

    if (idEmpleado) {
      filtrosOT.idpersonal = idEmpleado;
    }

    const response = await HOT.findAndCountAll({
      where: filtros,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OT,
          where: filtrosOT,
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
          ],
        },
        {
          model: empleados,
          attributes: attributesPersonal,
          as: "empleado_autorizador",
        },
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
