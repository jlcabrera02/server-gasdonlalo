import checklistBombaM from "../models/d.checklistBomba.model";
import auth from "../models/auth.model";
const { verificar } = auth;

const controller = {};

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const almacenar = [];

    for (let i = 1; i <= dias; i++) {
      let fecha = `${year}-${month}-${i}`;
      let response = await checklistBombaM.find(fecha);
      response = response.map((el) => ({
        ...el,
        fechaGenerada: fecha,
      }));
      almacenar.push({ fecha, data: [...response] });
    }

    res.status(200).json({ success: true, response: almacenar });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXidempleadoXfecha = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const { idEmpleado, fecha } = req.params;

    const response = await checklistBombaM.findXidempleadoXfecha([
      idEmpleado,
      fecha,
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

controller.totalChecks = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const { year, month } = req.params;
    const fecha = `${year}-${month}-01`;
    let response = await checklistBombaM.totalChecks(fecha);
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
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    const {
      fecha,
      islaLimpia,
      aceitesCompletos,
      idbomba,
      turno,
      idempleadoEntrante,
      idempleadoSaliente,
      cumple,
      motivo,
    } = req.body;

    const cuerpo = {
      fecha,
      isla_limpia: Number(islaLimpia),
      aceites_completos: Number(aceitesCompletos),
      idbomba: Number(idbomba),
      turno,
      idempleado_entrante: Number(idempleadoEntrante),
      idempleado_saliente: Number(idempleadoSaliente),
      idpuntaje_minimo: 1,
      motivo,
      cumple: cumple,
    };

    if (!cumple) {
      delete cuerpo.isla_limpia;
      delete cuerpo.aceites_completos;
      delete cuerpo.turno;
      delete cuerpo.idbomba;
      delete cuerpo.idbomba;
    }

    await checklistBombaM.validarExistencia([
      fecha,
      idempleadoEntrante,
      idbomba,
    ]); //valida si que no alla datos duplicados

    let response = await checklistBombaM.insert(cuerpo);
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

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 6);
    if (!user.success) throw user;
    const { id } = req.params;
    const {
      fecha,
      islaLimpia,
      aceitesCompletos,
      idbomba,
      turno,
      idempleadoEntrante,
      idempleadoSaliente,
    } = req.body;

    const cuerpo = {
      fecha,
      isla_limpia: Number(islaLimpia),
      aceites_completos: Number(aceitesCompletos),
      idbomba: Number(idbomba),
      turno,
      idempleado_entrante: Number(idempleadoEntrante),
      idempleado_saliente: Number(idempleadoSaliente),
      idpuntaje_minimo: 1,
    };

    const data = [cuerpo, id];
    let response = await checklistBombaM.update(data);
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

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 7);
    if (!user.success) throw user;
    const { id } = req.params;
    let response = await checklistBombaM.delete(id);
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
