import { Op } from "sequelize";
import rh from "../../models";
const { departamentos, tiposNominas, empleados, detalleEmpleado } = rh;

export async function buscarDetalles(req, res) {
  try {
    const response = await detalleEmpleado.findAll({
      include: [
        {
          model: empleados,
          include: departamentos,
        },
        {
          model: tiposNominas,
        },
      ],
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la nomina" });
  }
}

export async function buscarDetallesXEmpleados(req, res) {
  try {
    const response = [];
    const empleadosD = await empleados.findAll({
      where: {
        [Op.or]: [{ estatus: 1 }, { estatus: 2 }],
      },
      include: { model: departamentos },
    });
    for (let i = 0; i < empleadosD.length; i++) {
      const detalle = await detalleEmpleado.findOne({
        where: { idempleado: empleadosD[i].idempleado },
        include: { model: tiposNominas },
      });
      response.push({
        ...empleadosD[i]["dataValues"],
        referenciaBancaria: detalle,
      });
    }
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la nomina" });
  }
}

export async function crearDetalles(req, res) {
  try {
    const { idEmpleado, idTipoNomina } = req.body;

    const validar = await detalleEmpleado.findOne({
      where: { idempleado: idEmpleado },
    });

    if (validar) throw { code: 400, msg: "Ya tiene una referencia bancaria" };

    const response = await detalleEmpleado.create({
      idempleado: idEmpleado,
      idtipo_nomina: idTipoNomina,
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}

export async function editarDetalle(req, res) {
  try {
    const { idEmpleado } = req.params;
    const { idTipoNomina } = req.body;

    const response = await detalleEmpleado.update(
      {
        idtipo_nomina: idTipoNomina,
      },
      { where: { idempleado: idEmpleado } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}

export async function eliminarDetalle(req, res) {
  try {
    const { idEmpleado } = req.params;

    const response = await detalleEmpleado.destroy({
      where: { idempleado: idEmpleado },
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}
