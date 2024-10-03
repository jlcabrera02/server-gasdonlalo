import { Op } from "sequelize";
import modelos from "../../models/";
import sequelize from "../../config/configdb";
const { Preliquidaciones, empleados, Turnos } = modelos;

const controller = {};

controller.buscarPreliquidaciones = async (req, res) => {
  try {
    const { year, month, idEmpleado, idTurno, idEstacion } = req.query;
    const querys = {};

    if (year && month) {
      querys[Op.and] = [
        ...(querys[Op.and] || []),
        sequelize.where(
          sequelize.fn("MONTH", sequelize.col("fechaturno")),
          month
        ),
        sequelize.where(
          sequelize.fn("year", sequelize.col("fechaturno")),
          year
        ),
      ];
    }

    if (idEmpleado) {
      querys.idempleado = Number(idEmpleado);
    }
    if (idTurno) {
      querys.idturno = Number(idTurno);
    }
    if (idEstacion) {
      querys.idestacion_servicio = Number(idEstacion);
    }

    const response = await Preliquidaciones.findAll({
      where: querys,
      include: [{ model: empleados }, { model: Turnos }],
      order: [["idpreliquidacion", "DESC"]],
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

controller.actualizarPreliquidacion = async (req, res) => {
  try {
    const { fechaTurno, idEmpleado, idTurno, idEstacion } = req.body;
    const { idPreliquidacion } = req.params;

    const response = await Preliquidaciones.update(
      {
        fechaturno: fechaTurno,
        idempleado: idEmpleado,
        idturno: idTurno,
        idestacion_servicio: idEstacion,
      },
      { where: { idpreliquidacion: idPreliquidacion } }
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

controller.eliminarPreliquidacion = async (req, res) => {
  try {
    const { idPreliquidacion } = req.params;

    const response = await Preliquidaciones.destroy({
      where: { idpreliquidacion: idPreliquidacion },
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

//Busca un preliquidacion con los datos de la estacion_servicio, idturno, fechaturno y idempleado
controller.buscarPreliquidacion = async (req, res) => {
  const { idEstacionServicio, idTurno, fechaTurno, idEmpleado } = req.query;
  try {
    const response = await Preliquidaciones.findOne({
      where: {
        idempleado: idEmpleado,
        idturno: idTurno,
        fechaturno: fechaTurno,
        idestacion_servicio: idEstacionServicio,
      },
      order: [["idpreliquidacion", "DESC"]],
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

export default controller;
