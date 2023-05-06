import { Op } from "sequelize";
import rh from "../../models";
import auth from "../../models/auth.model";
const { verificar } = auth;
const { departamentos, tiposNominas, empleados, detalleEmpleado } = rh;
import { guardarBitacora } from "../../models/auditorias";
const area = "Referencias Bancarias";

export async function buscarDetalles(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
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
    console.log(err);
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener la nomina" });
  }
}

export async function buscarDetallesXEmpleados(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
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
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, idTipoNomina } = req.body;

    const validar = await detalleEmpleado.findOne({
      where: { idempleado: idEmpleado },
    });

    if (validar) throw { code: 400, msg: "Ya tiene una referencia bancaria" };

    const response = await detalleEmpleado.create({
      idempleado: idEmpleado,
      idtipo_nomina: idTipoNomina,
    });
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      idEmpleado,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}

export async function editarDetalle(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    const { idTipoNomina } = req.body;

    const response = await detalleEmpleado.update(
      {
        idtipo_nomina: idTipoNomina,
      },
      { where: { idempleado: idEmpleado } }
    );
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      idEmpleado,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);

    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}

export async function eliminarDetalle(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;

    const response = await detalleEmpleado.destroy({
      where: { idempleado: idEmpleado },
    });

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      4,
      idEmpleado,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}
