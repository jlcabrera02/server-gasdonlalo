import preM from "../models/l.preciogas.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
const { verificar } = auth;

const controller = {};

controller.insertarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { P, M, D, fecha } = req.body;
    const idempleadoC = user.token.data.datos.idempleado;

    const cuerpo = [
      ["M", fecha, idempleadoC, M],
      ["P", fecha, idempleadoC, P],
      ["D", fecha, idempleadoC, D],
    ];

    const response = await preM.nuevosPrecios(cuerpo);

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.obtenerPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha } = req.query;
    let response;
    if (fecha) {
      response = await preM.preciosPorFecha(fecha);
    } else {
      response = await preM.ultimosPrecios();
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.actualizarPrecios = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idPrecio } = req.params;
    const { precio } = req.body;

    const idempleadoC = user.token.data.datos.idempleado;

    const response = await preM.updatePrecios([precio, idempleadoC, idPrecio]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
