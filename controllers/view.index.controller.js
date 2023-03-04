const controller = {};
import empM from "../models/rh.empleado.model";
import mfM from "../models/d.montoFaltante.model";
import ckBM from "../models/d.checklistBomba.model";
import evUM from "../models/d.evaluacionUniforme.model";
import pdM from "../models/d.pasosDespachar.model";
import rdM from "../models/d.listaRecursosDespachador.model";
import oyLM from "../models/d.oylIsla.model";
import sncM from "../models/s.salidaNoConforme.model";
import formatTiempo from "../assets/formatTiempo";
const { tiempoDB, formatMes } = formatTiempo;
// import view from "../public/view/index.ejs";

controller.index = async (req, res) => {
  try {
    const despachadores = await empM.findEmpleadosXmesXiddepartamento(1);
    const hoy = new Date();
    const ordenar = despachadores.sort((a, b) => {
      if (a.idchecador > b.idchecador) {
        return 1;
      } else {
        return -1;
      }
    });
    //Obtiene cuantas paginas debe tener el empleado
    for (let i = 0; i < ordenar.length; i++) {
      const { fecha_registro, idempleado } = ordenar[i];
      let paginas = new Date(
        hoy.getTime() - new Date(tiempoDB(fecha_registro)).getTime()
      ).getMonth();
      paginas = paginas * 2;
      if (hoy.getDate() > 15) paginas += 1;
      ordenar[i].page = paginas;
      ordenar[i].link = `/${idempleado}/page/${paginas}`;
    }

    const cuerpo = { despachadores: ordenar };
    res.render("index", cuerpo);
  } catch (error) {
    console.log(error);
    res.render("error");
  }
};

controller.empleado = async (req, res) => {
  try {
    const { idEmpleado, page } = req.params;
    const empleado = await empM.findOne(idEmpleado);
    const hoy = new Date();
    const meses = new Date(
      hoy.getTime() - new Date(tiempoDB(empleado[0].fecha_registro))
    ).getMonth();

    const nEvaluaciones = [];

    let im = hoy.getMonth(),
      iy = Number(hoy.getFullYear());

    if (new Date().getDate() > 15) {
      nEvaluaciones.push({
        qna: 1,
        year: Number(hoy.getFullYear()),
        month: im + 1,
      });
    }

    for (let i = 0; i < meses; i++) {
      if (im === 0) {
        im = 12;
        iy -= 1;
      }

      nEvaluaciones.push({
        qna: 2,
        year: iy,
        month: im,
      });
      nEvaluaciones.push({
        qna: 1,
        year: iy,
        month: im,
      });

      im -= 1;
    }
    //Array en reversa
    nEvaluaciones.reverse();

    let pagina = Number(page - 1);
    const { year, month, qna } = nEvaluaciones[pagina];

    console.log(nEvaluaciones);

    const dias = new Date(year, month, 0).getDate();
    let fechaI, fechaF;
    if (qna < 2) {
      fechaI = `${year}-${month}-01`;
      fechaF = `${year}-${month}-15`;
    } else {
      fechaI = `${year}-${month}-16`;
      fechaF = `${year}-${month}-${dias}`;
    }

    const mf = await mfM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const ck = await ckBM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const evu = await evUM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const pd = await pdM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const rd = await rdM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const oyl = await oyLM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
    const snc = await sncM.findXMesXEmpleadoEv([
      [1, 3, 6, 7, 11],
      fechaI,
      fechaF,
      idEmpleado,
    ]);
    const fn = (n) => Number(n.toFixed(2));

    const ev = {
      mf: mf ? mf.total : 0,
      ck: ck.total,
      ev: evu.total,
      pd: pd ? fn(pd.promedio) : 0,
      rd: rd.total,
      oyl: oyl.total,
      snc: snc.total,
      nombre: `${empleado[0].nombre} ${empleado[0].apellido_paterno} ${empleado[0].apellido_materno}`,
      idchecador: empleado[0].idchecador,
      nEvaluaciones: nEvaluaciones,
      qna: qna,
      mes: formatMes(fechaI),
      ano: year,
      select: pagina + 1,
    };

    //Promedio

    let diasDiff = new Date(fechaF).getDate() - new Date(fechaI).getDate() + 1;

    ev.mfp = ev.mf > 0 ? 0.0 : 10.0;
    ev.ckp = fn((ev.ck / diasDiff) * 10);
    ev.evp = fn((ev.ev / evu.todo) * 10) || 0;
    ev.rdp = fn((ev.rd / rd.todo) * 10) || 0;
    ev.oylp = fn((ev.oyl / oyl.todo) * 10) || 0;
    ev.sncp = ev.snc > 5 ? 0 : fn(Math.abs((ev.snc * 5) / 25 - 1) * 10);

    ev.promedio = fn(
      (ev.mfp + ev.ckp + ev.evp + ev.rdp + ev.oylp + ev.sncp + ev.pd) / 7
    );

    console.log(ev);

    ev.ev = res.render("evempleado", ev);
  } catch (error) {
    console.log(error);
    res.render("error");
  }
};

export default controller;
