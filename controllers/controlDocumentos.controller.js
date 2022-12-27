import controlDocumentoM from "../models/controlDocumentos.model";

const controller = {};

controller.findTotalDocumentos = async (req, res) => {
  try {
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
    const { idempleado, iddocumento } = req.body;

    const cuerpo = {
      cumple: 1,
      idempleado: Number(idempleado),
      iddocumento: Number(iddocumento),
    };

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
    const { id } = req.params;
    const { idempleado, idcontrolDocumento } = req.body;

    const cuerpo = [idcontrolDocumento, idempleado];
    let response = await controlDocumentoM.update(cuerpo);
    console.log(response);
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
