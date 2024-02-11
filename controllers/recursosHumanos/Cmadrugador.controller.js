import { Op } from "sequelize";
import rh from "../../models";
import auth from "../../models/auth.model";
import CatInc from "../../models/recursosHumanos/CategorizarInc.model";
import { attributesPersonal } from "../../models/recursosHumanos/empleados.model";
const { verificar } = auth;
const { empleados, Cmadrugador, SNC, Incumplimientos, RM, departamentos } = rh;
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
      include: [
        {
          model: empleados,
          attributes: attributesPersonal,
          include: departamentos,
        },
      ],
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
    const { datos, fechaI, fechaF } = req.body;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const data = datos.map((el) => ({
      idconcurso: el.idconcurso,
      empleado: el.empleado,
      idempleado: el.idEmpleado,
      precio: el.precio,
      fecha_inicial: fechaI,
      fecha_final: fechaF,
      descuento: el.sncs.length === 0 ? "0" : el.sncs.length > 1 ? 100 : 50,
      devolucion: el.devolucion,
      cantidad_snc: el.sncs.length,
    }));

    const response = await RM.create({
      datos: data,
      fecha_inicial: fechaI,
      fecha_final: fechaF,
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
    const filtros = {};

    const response = await RM.findAll({
      where: filtros,
      order: [["fecha_inicial", "DESC"]],
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
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
    const { idConcurso } = req.params;

    const response = await RM.destroy({
      where: { idconcurso: idConcurso },
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

export async function editarFechaPago(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idConcurso } = req.params;
    const { fecha } = req.body;

    const response = await RM.update(
      { fecha_pago: fecha },
      { where: { idconcurso: idConcurso } }
    );

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al editar registro",
    });
  }
}
