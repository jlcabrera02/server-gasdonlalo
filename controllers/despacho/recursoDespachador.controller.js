import { Op } from "sequelize";
import sequelize from "../../config/configdb";
import models from "../../models/index";
import { obtenerConfiguraciones } from "../../services/configuracionesPersonalizables";
import formatTiempo from "../../assets/formatTiempo";
const {
  RecursosDespachadorEv,
  RecursosDespachador,
  Auditoria,
  empleados,
  SncNotification,
} = models;

const controller = {};

controller.getRecursos = async (req, res) => {
  try {
    const filtros = { vigente: true };
    const response = await RecursosDespachador.findAll({ where: filtros });

    return res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.getEv = async (req, res) => {
  try {
    const { month, year, quincena, idEmpleado, monthBack } = req.query;
    const filtrosEv = {};
    const filtrosEmpleado = { iddepartamento: 1 };

    if (month && year) {
      filtrosEv[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    if (idEmpleado) {
      const arrayEmpleados =
        typeof idEmpleado === "object" ? idEmpleado : [idEmpleado];
      console.log(idEmpleado);
      filtrosEmpleado.idempleado = arrayEmpleados;
    }

    if (monthBack) {
      const fecha = new Date(new Date().setDate(1)).setMonth(
        new Date().getMonth() - Number(monthBack)
      );

      filtrosEv.fecha = { [Op.gte]: fecha };
    }

    const response = await empleados.findAll({
      attributes: [
        "idempleado",
        "idchecador",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "nombre_completo",
      ],
      where: filtrosEmpleado,
      include: [
        {
          model: RecursosDespachadorEv,
          attributes: [
            "idevaluacion",
            "evaluacion",
            "idrecurso",
            "idempleado",
            "quincena",
            "fecha",
            "createdAt",
          ],
          as: "evaluaciones",
          include: RecursosDespachador,
          where: filtrosEv,
        },
      ],
    });

    if (quincena) {
      const newResponse = JSON.parse(JSON.stringify(response)).map((emp) => ({
        ...emp,
        evaluaciones: emp.evaluaciones.filter(
          (ev) => ev.quincena === Number(quincena)
        ),
      }));

      return res.status(200).json({
        success: true,
        response: newResponse,
      });
    }

    return res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

controller.createEv = async (req, res) => {
  try {
    const { idEmpleado, evaluaciones, fecha } = req.body;
    const ev = evaluaciones.map((ev) => ({
      idrecurso: ev.idRecurso,
      evaluacion: ev.evaluacion,
      idempleado: idEmpleado,
      fecha,
    }));

    const incumple = evaluaciones.some((ev) => !ev.evaluacion);

    if (incumple) {
      const sncNotificationFind =
        obtenerConfiguraciones().configSNC.sncacumuladas.find(
          (el) => el.notificacion === "Recursos de despachador"
        );

      const empleadoName = await empleados.findOne({
        attributes: [
          "nombre",
          "apellido_paterno",
          "apellido_materno",
          "nombre_completo",
        ],
        where: { idempleado: idEmpleado },
      });

      const descripcion = sncNotificationFind.descripcion
        .replaceAll(
          `\$\{empleado\}`,
          JSON.parse(JSON.stringify(empleadoName)).nombre_completo.toLowerCase()
        )
        .replaceAll(`\$\{fecha\}`, formatTiempo.tiempoLocalShort(fecha));

      await SncNotification.create({
        idincumplimiento: sncNotificationFind.idincumplimiento,
        descripcion: descripcion,
        idempleado: idEmpleado,
        fecha: fecha,
      });
    }

    const response = await RecursosDespachadorEv.bulkCreate(ev);

    return res.status(200).json({ succcess: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.updateEv = async (req, res) => {
  try {
    const { evaluaciones, fecha } = req.body;
    const ev = evaluaciones.map((ev) => ({
      evaluacion: ev.evaluacion,
      idevaluacion: ev.idEvaluacion,
      idempleado: ev.idEmpleado,
      idrecurso: ev.idRecurso,
      fecha,
    }));

    const response = await sequelize.transaction(async (t) => {
      const responses = [];
      for (let i = 0; i < ev.length; i++) {
        const update = await RecursosDespachadorEv.update(
          { evaluacion: ev[i].evaluacion, fecha: ev[i].fecha },
          { where: { idevaluacion: ev[i].idevaluacion }, transaction: t }
        );

        responses.push({
          status: update,
          idrecurso: ev[i].idrecurso,
          idevaluacion: ev[i].idevaluacion,
        });
      }

      return responses;
    });

    // await Auditoria.create({});

    return res.status(200).json({ succcess: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

controller.deleteEv = async (req, res) => {
  try {
    const { id } = req.query;
    const ids = id.map((id) => Number(id));

    const response = await sequelize.transaction(async (t) => {
      const responses = [];
      for (let i = 0; i < ids.length; i++) {
        const update = await RecursosDespachadorEv.destroy({
          where: { idevaluacion: ids[i] },
          transaction: t,
        });

        responses.push({
          status: update,
          idevaluacion: ids[i],
        });
      }

      return responses;
    });

    // await Auditoria.create({});

    return res.status(200).json({ succcess: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

export default controller;
