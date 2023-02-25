const controller = {};
import empM from "../models/rh.empleado.model";
import mfM from "../models/d.montoFaltante.model";
import ckBM from "../models/d.checklistBomba.model";
import evUM from "../models/d.evaluacionUniforme.model";
import pdM from "../models/d.pasosDespachar.model";
import rdM from "../models/d.listaRecursosDespachador.model";
// import view from "../public/view/index.ejs";

controller.index = async (req, res) => {
  try {
    const despachadores = await empM.findEmpleadosXmesXiddepartamento(1);
    const cuerpo = { despachadores };
    res.render("index", cuerpo);
  } catch (error) {
    console.log(error);
    res.render("error");
  }
};

controller.indexsd = async (req, res) => {
  try {
    const dias = new Date(2023, 2, 0).getDate();
    const qna = 2;
    let fechaI, fechaF;
    if (qna < 2) {
      fechaI = `2023-02-01`;
      fechaF = `2023-02-15`;
    } else {
      fechaI = `2023-02-16`;
      fechaF = `2023-02-${dias}`;
    }
    console.log(fechaI, fechaF);
    const mf = await mfM.findXMesXEmpleadoEv([fechaI, fechaF, 2]);
    const ck = await ckBM.findXMesXEmpleadoEv([fechaI, fechaF, 2]);
    const evu = await evUM.findXMesXEmpleadoEv([fechaI, fechaF, 2]);
    const pd = await pdM.findXMesXEmpleadoEv([fechaI, fechaF, 2]);
    const rd = await rdM.findXMesXEmpleadoEv([fechaI, fechaF, 2]);
    const ev = {
      mf: mf ? mf.total : 0,
      ck: ck.total,
      ev: evu.total,
      pd: pd ? pd.promedio.toFixed(2) : 0,
      rd: rd.total,
    };
    console.log(ev);
    res.render("index", ev);
  } catch (error) {
    console.log(error);
    res.render("error");
  }
};

export default controller;
