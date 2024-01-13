import { Op } from "sequelize";
import models from "../../models";
import sequelize from "../../config/configdb";
import {
  obtenerConfiguraciones,
  escribirConfiguraciones,
} from "../../services/configuracionesPersonalizables";
const { empleados, SNC, Incumplimientos } = models;

export async function buscarSNCXEmpleado(req, res) {
  try {
    const { idEmpleado } = req.params;
    const { fechaI, fechaF, month, year } = req.query;

    let options = {
      where: {
        idempleado: idEmpleado,
      },
      include: [
        {
          model: empleados,
          as: "empleado_autoriza",
        },
        {
          model: empleados,
        },
        {
          model: Incumplimientos,
        },
      ],
    };

    if (fechaI && fechaF) {
      options.where.fecha = { [Op.between]: [fechaI, fechaF] };
    } else {
      options.where[Op.and] = [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    const response = await SNC.findAll(options);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({
      success: false,
      err,
      msg: "Error al obtener las salidas no conformes por empleado",
    });
  }
}

export async function obtenerRegistros(req, res) {
  try {
    const {
      fechaI,
      fechaF,
      month,
      year,
      idEmpleado,
      idIncumplimiento,
      folio,
      etapa, //1 es por capturar, 2 es por corregir, 3 es finalizada
    } = req.query;

    const querys = {};
    const queryIncumplimientos = {};

    if (idIncumplimiento) {
      queryIncumplimientos.idIncumplimiento = Number(idIncumplimiento);
    }

    if (etapa === "2") {
      querys[Op.and] = [{ acciones_corregir: null }, { concesiones: null }];
    }

    if (etapa === "3") {
      querys[Op.or] = [
        { acciones_corregir: { [Op.not]: null } },
        { concesiones: { [Op.not]: null } },
      ];
    }

    if (year && month) {
      querys[Op.and] = [
        ...(querys[Op.and] || []),
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    if (idEmpleado) {
      querys.idempleado = Number(idEmpleado);
    }

    if (folio) {
      querys.idsalida_noconforme = Number(folio);
    }

    if (fechaI && fechaF) {
      querys.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    const response = await SNC.findAll({
      where: querys,
      include: [
        {
          model: empleados,
          as: "empleado_autoriza",
        },
        {
          model: empleados,
        },
        {
          model: Incumplimientos,
          where: queryIncumplimientos,
        },
      ],
      order: [["idsalida_noconforme", "DESC"]],
    });

    if (response.length === 0) {
      throw { success: false, code: 404, msg: "No se encontraron archivos" };
    }

    const resp = JSON.parse(JSON.stringify(response)).map((el) => {
      if (!el.empleado) {
        return {
          ...el,
          empleado: {
            nombre: "GASOLINERIA",
            apellido_paterno: "DON",
            apellido_materno: "LALO",
          },
        };
      }
      return el;
    });

    res.status(200).json({ success: true, response: resp });
  } catch (err) {
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al obtener los registros de SNC",
    });
  }
}

export async function configSnc(req, res) {
  const config = obtenerConfiguraciones().configSNC;
  res.status(200).json({ success: true, response: config });
}

export async function updateConfigSnc(req, res) {
  const configuraciones = {
    configSNC: {
      sncacumuladas: req.body,
    },
  };
  escribirConfiguraciones(configuraciones);

  res.status(200).json({ success: true, response: "Se guardo correctamente" });
}

export async function obtenerReportesEmpleados(req, res) {
  try {
    const {
      fechaI,
      fechaF,
      month,
      year,
      idEmpleado,
      idIncumplimiento,
      idDepartamento,
      etapa, //1 es por capturar, 2 es por corregir, 3 es finalizada
    } = req.query;

    const querysSnc = {};
    const querysEmpleado = {};
    const queryIncumplimientos = {};

    if (idIncumplimiento) {
      queryIncumplimientos.idIncumplimiento = Number(idIncumplimiento);
    }

    if (etapa === "2") {
      querysSnc[Op.and] = [{ acciones_corregir: null }, { concesiones: null }];
    }

    if (etapa === "3") {
      querysSnc[Op.or] = [
        { acciones_corregir: { [Op.not]: null } },
        { concesiones: { [Op.not]: null } },
      ];
    }

    if (year && month) {
      querysSnc[Op.and] = [
        ...(querysSnc[Op.and] || []),
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    if (idEmpleado) {
      querysEmpleado.idempleado = Number(idEmpleado);
    }

    if (idDepartamento) {
      querysEmpleado.idDepartamento = Number(idDepartamento);
    }

    if (fechaI && fechaF) {
      querysSnc.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    const response = await empleados.findAll({
      attributes: [
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "iddepartamento",
        "idempleado",
        "nombre_completo",
      ],
      where: querysEmpleado,
      include: [
        {
          model: SNC,
          where: querysSnc,
          attributes: ["idsalida_noconforme", "fecha"],
          include: Incumplimientos,
        },
      ],
    });

    res.status(200).json({ success: true, response: response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al obtener los registros de SNC",
    });
  }
}
