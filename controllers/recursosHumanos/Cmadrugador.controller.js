import rh from "../../models";
import auth from "../../models/auth.model";
import { attributesPersonal } from "../../models/recursosHumanos/empleados.model";
const { verificar } = auth;
const { empleados, Cmadrugador } = rh;
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
      msg: "Error al crear configuración de madrugador",
    });
  }
}

export async function obtenerConfiguracion(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await Cmadrugador.findAll({
      where: { fecha: null },
      include: [{ model: empleados, attributes: attributesPersonal }],
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

export async function guardarRegistros(req, res) {
  try {
    const datos = req.body.datos;
    const fecha = req.body.fecha;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const data = datos.map((el) => ({
      idconcurso: el.idconcurso,
      idempleado: el.idEmpleado,
      precio: el.precio,
      fecha,
    }));

    const response = await Cmadrugador.bulkCreate(data, {
      updateOnDuplicate: ["idconcurso"],
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
    const { idconcurso } = req.body;
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await Cmadrugador.destroy({ where: idconcurso });

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
