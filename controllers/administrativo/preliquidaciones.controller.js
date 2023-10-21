import modelos from "../../models/";
const { Preliquidaciones } = modelos;

const controller = {};

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
