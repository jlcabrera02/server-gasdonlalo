import incumplimientoM from "../models/s.incumplimiento.model";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    let response = await incumplimientoM.find();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findByConcurso = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idConcurso } = req.params;
    let response = await incumplimientoM.findByConcurso(Number(idConcurso));
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findIncumplimientosXcategorizacion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idCategorizacion, iddepartamento } = req.params;
    const response = await incumplimientoM.findIncumplimientosXcategorizacion(
      idCategorizacion,
      iddepartamento
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 11);
    if (!user.success) throw user;
    const { incumplimiento } = req.body;
    const cuerpo = {
      incumplimiento: incumplimiento.toUpperCase(),
    };
    let response = await incumplimientoM.insert(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.categorizarSNC = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.categorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.descategorizarSNC = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.descategorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};
controller.categorizarSNC = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idIncumplimiento, idConcurso } = req.body;
    const cuerpo = [Number(idConcurso), Number(idIncumplimiento)];
    let response = await incumplimientoM.categorizarSNC(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.updateCantidadInc = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { cantidad, idConcurso, idIncumplimiento } = req.body;
    const cuerpo = [
      Number(cantidad),
      Number(idConcurso),
      Number(idIncumplimiento),
    ];
    let response = await incumplimientoM.updateCantidadInc(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 11);
    if (!user.success) throw user;
    const { id } = req.params;
    const { incumplimiento } = req.body;
    const cuerpo = {
      incumplimiento: incumplimiento.toUpperCase(),
    };
    const data = [cuerpo, id];
    let response = await incumplimientoM.update(data);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 11);
    if (!user.success) throw user;
    const { id } = req.params;
    let response = await incumplimientoM.delete(id);
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
