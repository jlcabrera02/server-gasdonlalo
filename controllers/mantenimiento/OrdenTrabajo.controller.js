import modelos from "../../models";
import auth from "../../models/auth.model";
import sequelize from "../../config/configdb";
import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../../services/configuracionesPersonalizables";
import snca from "../../models/s.acumular.model";
import format from "../../assets/formatTiempo";
import Decimal from "decimal.js-light";
import Utencilios from "../../models/mantenimiento/Utencilios";
const { verificar } = auth;
const { OT, PanicBtn, empleados } = modelos;

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
    const { utencilio, costo } = req.body;

    const response = await Utencilios.update(
      { utencilio, costo },
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
    const { utencilio, costo } = req.body;

    const response = await Utencilios.create({ utencilio, costo });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    console.log(err);
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
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
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
    const {
      fecha,
      tipoMantenimiento,
      descripcionFalla,
      idArea,
      idEstacionServicio,
    } = req.body;

    const response = await OT.create({
      idsolicitante: user.token.data.datos.idempleado,
      tipo_mantenimiento: tipoMantenimiento,
      fecha_inicio: fecha,
      idarea: idArea,
      idestacion_servicio: idEstacionServicio,
      descripcion_falla: descripcionFalla,
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

    const { estatus } = req.query;
    const query = { estatus: 4 };

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

    const response = await OT.findAll({
      where: query,
      include: [{ model: empleados, as: "personal" }],
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

    if (!ot)
      throw {
        success: false,
        code: 400,
        msg: "No se encontro el elemento en la Base de datos",
      };

    if (tipoPersonal === 2) {
      idPersonal = null;
    }

    const fechaTermino = format.tiempoDBComplete(Date.now());

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
      .map((el) => el.coste)
      .reduce((a, b) => new Decimal(a).add(new Decimal(b).toFixed(2)), 0);

    const totalGeneral = new Decimal(totalCostoHora)
      .add(new Decimal(costoHerramientas))
      .toFixed(2);

    const detallesCosto = {
      horasAcumuladas: trasformHours,
      pagoHora: totalCostoHora,
      costoTotalHerramientaEinsumos: costoHerramientas,
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
    console.log(err);
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
    const { procedio } = req.body;

    const ot = await OT.findOne({ where: { idorden_trabajo: idOT } });

    if (!ot)
      throw {
        success: false,
        code: 400,
        msg: "No se encontro una orden de trabajo",
      };

    if (procedio) {
      const response = await OT.update(
        {
          estatus: 4,
          idliberante: idPersonal,
        },
        { where: { idorden_trabajo: idOT } }
      );
      res.status(200).json({ success: true, response });
    } else {
      const response = await OT.update(
        {
          estatus: 2,
          idliberante: idPersonal,
        },
        { where: { idorden_trabajo: idOT } }
      );

      if (ot.dataValues.idpersonal) {
        await snca.insert([
          19,
          ot.dataValues.idpersonal,
          fecha,
          `No paso cumplio correctamente con una OT`,
        ]);
      }

      res.status(200).json({ success: true, response });
    }
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
