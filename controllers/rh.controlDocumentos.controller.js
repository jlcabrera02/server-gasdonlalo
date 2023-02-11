import controlDocumentoM from "../models/rh.controlDocumentos.model";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};

controller.findTotalDocumentos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    let response = await controlDocumentoM.findTotalDocumentos();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findDocumentosXIdempleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idEmpleado } = req.params;
    let response = await controlDocumentoM.findDocumentosXIdempleado(
      idEmpleado
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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idempleado, iddocumento } = req.body;

    const cuerpo = {
      cumple: 1,
      idempleado: Number(idempleado),
      iddocumento: Number(iddocumento),
    };

    await controlDocumentoM.verificarDExistente([
      cuerpo.idempleado,
      cuerpo.iddocumento,
    ]);

    let response = await controlDocumentoM.insert(cuerpo);

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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idempleado, iddocumento } = req.body;

    const cuerpo = [iddocumento, idempleado];
    let response = await controlDocumentoM.update(cuerpo);
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
