import { Op } from "sequelize";
import sequelize from "../../config/configdb";
import models from "../../models/index";
const { RecursosDespachadorEv, RecursosDespachador, Auditoria, empleados } =
  models;

const area = "Recurso Despachador";

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
    const { month, year, quincena, idEmpleado } = req.query;
    const filtrosEv = {};
    const filtrosEmpleado = { iddepartamento: 1 };

    if (month && year) {
      filtrosEv[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    if (idEmpleado) {
      filtrosEmpleado.idempleado = idEmpleado;
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

    const response = await RecursosDespachadorEv.bulkCreate(ev);

    // await Auditoria.create({});

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
