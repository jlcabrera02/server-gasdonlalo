import acuM from "../models/s.acumular.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idSncacumulada } = req.params;
    let response = await acuM.delete(idSncacumulada);
    await guardarBitacora([
      "snc pendientes por captura",
      user.token.data.datos.idempleado,
      4,
      idSncacumulada,
    ]);
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
