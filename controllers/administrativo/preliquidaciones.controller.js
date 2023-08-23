import modelos from "../../models/";
const { Preliquidaciones } = modelos;

const controller = {};

controller.crearPreliquidacion = async (req, res) => {
  const {
    lecturas,
    vales,
    efecivo,
    idEmpleado,
    idTurno,
    fechaTurno,
    idEstacionServicio,
  } = req.body;
  try {
    const response = await Preliquidaciones.create({
      lecturas,
      vales,
      efecivo,
      idempleado: idEmpleado,
      idturno: idTurno,
      fechaturno: fechaTurno,
      idestacion_servicio: idEstacionServicio,
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
