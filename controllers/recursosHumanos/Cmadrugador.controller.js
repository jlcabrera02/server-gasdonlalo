import { Op } from "sequelize";
import rh from "../../models";
import auth from "../../models/auth.model";
import CatInc from "../../models/recursosHumanos/CategorizarInc.model";
import { attributesPersonal } from "../../models/recursosHumanos/empleados.model";
const { verificar } = auth;
const { empleados, Cmadrugador, SNC, Incumplimientos } = rh;
/* import { guardarBitacora } from "../../models/auditorias";
const area = "Concurso Madrugador"; */

export async function configuracion(req, res) {
  try {
    const { idEmpleado, precio } = req.body;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await Cmadrugador.create({
      idempleado: idEmpleado,
      precio,
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al crear configuración de madrugador",
    });
  }
}

export async function editarConfiguracion(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const { precio } = req.body;
    const { idconcurso } = req.params;

    const response = await Cmadrugador.update(
      { precio },
      { where: { idconcurso } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al editar configuración de madrugador",
    });
  }
}

export async function obtenerConfiguracion(req, res) {
  try {
    const { fechaI, fechaF } = req.query;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const cumplimientoAfectados = await CatInc.findAll({
      where: { idconcurso: 1 },
    });

    const snc = await SNC.findAll({
      attributes: [
        "idincumplimiento",
        "idempleado",
        "idsalida_noconforme",
        "fecha",
      ],
      where: {
        fecha: { [Op.between]: [fechaI, fechaF] },
        idincumplimiento: cumplimientoAfectados.map(
          (el) => el.dataValues.idincumplimiento
        ),
      },
      include: Incumplimientos,
    });

    const response = await Cmadrugador.findAll({
      where: { sncs: null, devolucion: null },
      include: [{ model: empleados, attributes: attributesPersonal }],
    });

    res
      .status(200)
      .json({ success: true, response, cumplimientoAfectados, snc });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al crear configuración de madrugador",
    });
  }
}

export async function guardarRegistros(req, res) {
  try {
    const { datos, fechaI, fechaF, sncs, devolucion } = req.body;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const data = datos.map((el) => ({
      idconcurso: el.idconcurso,
      idempleado: el.idEmpleado,
      precio: el.precio,
      fecha_inicial: fechaI,
      fecha_final: fechaF,
      devolucion: el.devolucion,
      sncs: el.sncs,
    }));

    const response = await Cmadrugador.bulkCreate(data, {
      updateOnDuplicate: ["fecha_inicial", "fecha_final", "sncs", "devolucion"],
    });

    const create = await Cmadrugador.bulkCreate(
      data.map(({ idempleado, precio }) => ({ idempleado, precio }))
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al crear configuración de madrugador",
    });
  }
}

export async function eliminarConfiguracion(req, res) {
  try {
    const { idconcurso } = req.params;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await Cmadrugador.destroy({ where: { idconcurso } });

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al eliminar elemento",
    });
  }
}

export async function obtenerRegistros(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await Cmadrugador.findAll({
      where: { sncs: { [Op.not]: null }, devolucion: { [Op.not]: null } },
      include: [{ model: empleados, attributes: attributesPersonal }],
      order: [["fecha_inicial", "DESC"]],
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al obtener registros",
    });
  }
}

export async function eliminarRegistros(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { registros } = req.body;

    const response = await Cmadrugador.destroy({
      where: { idconcurso: registros.map((el) => el.idconcurso) },
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({
      success: false,
      err,
      msg: "Error al eliminar registros",
    });
  }
}
