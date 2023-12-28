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
    const response = await empleados.findAll({
      attributes: [
        "idempleado",
        "idchecador",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
      ],
      where: { idempleado: 131 },
      include: [
        {
          model: RecursosDespachadorEv,
          attributes: ["idevaluacion", "evaluacion", "idrecurso", "idempleado"],
          as: "evaluaciones",
          include: RecursosDespachador,
        },
      ],
    });

    return res.status(200).json({ succcess: true, response });
  } catch (err) {
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

export default controller;
