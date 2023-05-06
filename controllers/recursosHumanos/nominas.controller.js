import { Op } from "sequelize";
import rh from "../../models";
import departamento from "../../models/recursosHumanos/departamentos.model";
import { guardarBitacora } from "../../models/auditorias";
import auth from "../../models/auth.model";
const { nominas, tiposNominas, empleados } = rh;
const { verificar } = auth;
const area = "Nominas";
const areaSub = "Tipo Nomina";

export async function guardarNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEmpleado, fecha, monto, idTipoNomina } = req.body;
    const response = await nominas.create({
      idempleado: idEmpleado,
      fecha,
      idtipo_nomina: idTipoNomina,
      monto,
    });
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      response.idturno,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al guardar la nomina" });
  }
}

export async function obtenerNominas(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
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

export async function obtenerUltimoRegistro(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const response = await nominas.findOne({
      include: [
        {
          model: tiposNominas,
        },
        { model: empleados, include: [{ model: departamento }] },
      ],
      limit: 1,
      order: [["idnomina", "DESC"]],
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function obtenerNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idNomina } = req.params;
    const response = await nominas.findOne({
      include: [
        {
          model: tiposNominas,
        },
        { model: empleados, include: [{ model: departamento }] },
      ],
      where: {
        idnomina: idNomina,
      },
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function actualizarNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
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
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      idNomina,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function eliminarNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idNomina } = req.params;
    const response = await nominas.destroy({
      where: { idnomina: idNomina },
    });
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      4,
      idNomina,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
}

export async function guardarTipoNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { tipo, banco } = req.body;
    const response = await tiposNominas.create({
      tipo,
      banco,
    });
    await guardarBitacora([
      areaSub,
      user.token.data.datos.idempleado,
      2,
      response.idtipo_nomina,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err: err, msg: "asd" });
  }
}

export async function editarTipoNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idTipo } = req.params;
    const { tipo, banco } = req.body;
    const response = await tiposNominas.update(
      {
        tipo,
        banco,
      },
      { where: { idtipo_nomina: idTipo } }
    );
    await guardarBitacora([
      areaSub,
      user.token.data.datos.idempleado,
      3,
      idTipo,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err: err, msg: "asd" });
  }
}

export async function eliminarTipoNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idTipo } = req.params;
    const response = await tiposNominas.destroy({
      where: { idtipo_nomina: idTipo },
    });
    await guardarBitacora([
      areaSub,
      user.token.data.datos.idempleado,
      4,
      idTipo,
    ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err: err, msg: "asd" });
  }
}

export async function obtenerTipoNomina(req, res) {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const response = await tiposNominas.findAll();

    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
}
