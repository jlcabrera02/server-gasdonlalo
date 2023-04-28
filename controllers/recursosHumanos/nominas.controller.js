import { Op } from "sequelize";
import rh from "../../models";
import departamento from "../../models/recursosHumanos/departamentos.model";
const { nominas, tiposNominas, empleados } = rh;

export async function guardarNomina(req, res) {
  try {
    const { idEmpleado, fecha, monto, idTipoNomina } = req.body;
    const response = await nominas.create({
      idempleado: idEmpleado,
      fecha,
      idtipo_nomina: idTipoNomina,
      monto,
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err, msg: "asd" });
  }
}

export async function obtenerNominas(req, res) {
  try {
    const { fechaI, fechaF } = req.query;
    const response = await nominas.findAll({
      include: [
        {
          model: tiposNominas,
        },
        { model: empleados, include: [{ model: departamento }] },
      ],
      where: {
        fecha: { [Op.between]: [fechaI, fechaF] },
      },
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function actualizarNomina(req, res) {
  try {
    const { idNomina } = req.params;
    const { idEmpleado, fecha, monto, idTipoNomina } = req.body;
    const cuerpo = {
      idempleado: idEmpleado,
      fecha,
      idtipo_nomina: idTipoNomina,
      monto,
    };
    const response = await nominas.update(cuerpo, {
      where: { idnomina: idNomina },
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function eliminarNomina(req, res) {
  try {
    const { idNomina } = req.params;
    const response = await nominas.destroy({
      where: { idnomina: idNomina },
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function guardarTipoNomina(req, res) {
  try {
    const { tipo, banco } = req.body;
    const response = await tiposNominas.create({
      tipo,
      banco,
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err: err, msg: "asd" });
  }
}
