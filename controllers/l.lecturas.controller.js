import lecM from "../models/l.lecturas.model";
import preM from "../models/l.preciogas.model";
import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import ft from "../assets/formatTiempo";
const { verificar } = auth;

const controller = {};

controller.lecturasIniciales = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idEstacion } = req.params;
    const { folio } = req.query;
    const precios = await preM.ultimosPrecios();

    let lastFolio;
    if (folio) {
      lastFolio = Number(folio);
    } else {
      lastFolio = await lecM.lastFolio(idEstacion);
    }

    const response = await lecM.lecturasIniciales([idEstacion, lastFolio]);

    res
      .status(200)
      .json({ success: true, response, folio: lastFolio, precios });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateLecturaInicial = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let response;

    let idFolio = req.body[0].folio ? req.body[0].folio : 0;

    const cuerpoEdit = req.body.map((el) => [
      el.lectura,
      idFolio,
      el.idmanguera,
    ]);

    const cuerpoInsert = req.body.map((el) => [
      el.idmanguera,
      el.lectura,
      el.fecha,
      0,
    ]);

    if (req.body[0].folio === null) {
      response = await lecM.insertLecturas(cuerpoInsert);
    } else {
      response = await lecM.updateLecturaInicial(cuerpoEdit);
    }

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
