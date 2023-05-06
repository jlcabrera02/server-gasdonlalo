import formatTiempo from "../../assets/formatTiempo";
import models from "../../models";
const { Turnos } = models;

export async function obtenerTurnos(req, res) {
  try {
    const response = await Turnos.findAll({ where: { mostrar: true } });
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al obtener los turnos" });
  }
}

export async function crearTurno(req, res) {
  try {
    const { horaEmpiezo, horaTermino, turno } = req.body;
    const hora_anticipo = new Date(`2022-12-14 ${horaEmpiezo}`).setMinutes(
      new Date(`2022-12-14 ${horaEmpiezo}`).getMinutes() - 15
    );

    const cuerpo = {
      hora_anticipo: formatTiempo.formatHours(hora_anticipo, false),
      hora_empiezo: horaEmpiezo,
      hora_termino: horaTermino,
      turno,
    };

    const response = await Turnos.create(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al crear el turno" });
  }
}

export async function actTurno(req, res) {
  try {
    const { idTurno } = req.params;
    const { horaEmpiezo, horaTermino, turno } = req.body;
    const hora_anticipo = new Date(`2022-12-14 ${horaEmpiezo}`).setMinutes(
      new Date(`2022-12-14 ${horaEmpiezo}`).getMinutes() - 15
    );

    const cuerpo = {
      hora_anticipo: formatTiempo.formatHours(hora_anticipo, false),
      hora_empiezo: horaEmpiezo,
      hora_termino: horaTermino,
      turno,
    };

    const response = await Turnos.update(cuerpo, {
      where: { idturno: idTurno },
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al crear el turno" });
  }
}

export async function eliminarTurno(req, res) {
  try {
    const { idTurno } = req.params;
    const response = await Turnos.update(
      { mostrar: false },
      { where: { idturno: idTurno } }
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, err, msg: "Error al eliminar el turno" });
  }
}
