import estSerM from "../models/ad.estacionService.model";
import auth from "../models/auth.model";
import tp from "../assets/formatTiempo";
import models from "../models/";
import { Op } from "sequelize";
import sequelize from "../config/configdb";
const { CodigosUso } = models;
const { diff, tiempoDB, tiempoHorario } = tp;
const { verificar } = auth;

const controller = {};
const area = "Horarios";

controller.obtenerCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;

    const response = await CodigosUso.findAll();

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.nuevoCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { id, descripcion } = req.body;

    const response = await CodigosUso.create({
      idcodigo_uso: id,
      descripcion: descripcion.trim(),
    });

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

controller.editarCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { descripcion } = req.body;
    const { idCodigoUso } = req.params;

    const response = await CodigosUso.update(
      {
        descripcion: descripcion.trim(),
      },
      {
        where: {
          idcodigo_uso: idCodigoUso,
        },
      }
    );

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

controller.eliminarCodigoUso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idCodigoUso } = req.params;

    const response = await CodigosUso.destroy({
      where: {
        idcodigo_uso: idCodigoUso,
      },
    });

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
