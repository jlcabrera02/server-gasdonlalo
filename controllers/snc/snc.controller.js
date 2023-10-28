import { Op } from "sequelize";
import models from "../../models";
import sequelize from "../../config/configdb";
import Incumplimientos from "../../models/snc/incumplimientos";
const { empleados, SNC } = models;

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
    console.log(err);
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
      noValidados,
    } = req.query;

    const querys = {};
    const queryIncumplimientos = {};

    if (idIncumplimiento) {
      queryIncumplimientos.idIncumplimiento = Number(idIncumplimiento);
    }

    if (noValidados) {
      querys[Op.and] = [{ acciones_corregir: null }, { concesiones: null }];
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

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: err.msg || "Error al obtener los registros de SNC",
    });
  }
}
