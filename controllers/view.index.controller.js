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
    function qnas(a, b) {
      let an = new Date(a).getTime();
      let ne = new Date(b).getTime();

      let diff = an - ne;
      let dias = diff / (60 * 60 * 24 * 1000);
      let quincenas = dias / 15;
      return Math.round(quincenas);
    }
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
      let paginas = qnas(hoy, tiempoDB(fecha_registro)) + 1;
      // if (hoy.getDate() > 15) paginas += 1;
      ordenar[i].page = paginas;
      ordenar[i].link = `/${idempleado}/page/${paginas - 1}`;
    }

    const cuerpo = { despachadores: ordenar };
    res.render("index", cuerpo);
  } catch (error) {
    res.render("error");
  }
};

controller.empleado = async (req, res) => {
  try {
    const { idEmpleado, page } = req.params;
    const empleado = await empM.findOne(idEmpleado);
    const hoy = new Date();
    const meses = new Date(
      hoy.getTime() - new Date(tiempoDB(empleado[0].fecha_registro)).getTime()
    ).getMonth();

    function qnas(a, b) {
      let an = new Date(a).getTime();
      let ne = new Date(b).getTime();

      let diff = an - ne;
      let dias = diff / (60 * 60 * 24 * 1000);
      let quincenas = dias / 15;
      return Math.round(quincenas);
    }

    let cantidad = qnas(hoy, tiempoDB(empleado[0].fecha_registro));

    const nEvaluaciones = [];

    let dia = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = Number(new Date().getFullYear());

    for (let i = 0; i < cantidad; i++) {
      let qn = 15 * (i + 1);
      let today = new Date(new Date().setDate(hoy.getDate() - qn));
      dia = today.getDate();
      mes = today.getMonth() + 1;
      anio = Number(today.getFullYear());
      let ulDia = new Date(anio, mes, 0).getDate();
      if (dia > 15) {
        nEvaluaciones.push({
          qna: 2,
          year: anio,
          month: mes,
          fechaI: `${anio}-${mes}-01`,
          fechaF: `${anio}-${mes}-15`,
        });
      } else {
        nEvaluaciones.push({
          qna: 1,
          year: anio,
          month: mes,
          fechaI: `${anio}-${mes}-16`,
          fechaF: `${anio}-${mes}-${ulDia}`,
        });
      }
    }

    //Array en reversa
    nEvaluaciones.reverse();

    let pagina = Number(page - 1);
    const { year, month, qna } = nEvaluaciones[pagina];

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
      [10, 3, 6, 7, 11, 13],
      fechaI,
      fechaF,
      idEmpleado,
    ]);
    const sncTotales = await sncM.findXMesXEmpleadoEv([
      [0],
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
      sncTotales: sncTotales.total,
      nombre: `${empleado[0].nombre} ${empleado[0].apellido_paterno} ${empleado[0].apellido_materno}`,
      idchecador: empleado[0].idchecador,
      nEvaluaciones: nEvaluaciones,
      qnas: cantidad,
      qna: qna,
      mes: formatMes(fechaI),
      ano: year,
      departamento: empleado[0].departamento,
      select: pagina + 1,
    };

    //Promedio

    // let diasDiff = new Date(fechaF).getDate() - new Date(fechaI).getDate() + 1;

    ev.mfp = ev.mf > 0 ? 0.0 : 10.0;
    ev.ckp = fn((ev.ck / 12) * 10) > 10 ? 10 : fn((ev.ck / 12) * 10);
    ev.evp = fn((ev.ev / evu.todo) * 10) || 0;
    ev.rdp = fn((ev.rd / rd.todo) * 10) || 0;
    ev.oylp = fn((ev.oyl / oyl.todo) * 10) || 0;
    // ev.sncp = ev.snc > 5 ? 0 : fn(Math.abs((ev.snc * 5) / 25 - 1) * 10);

    /* ev.promedio = fn(
      (ev.mfp + ev.ckp + ev.evp + ev.rdp + ev.oylp + ev.sncp + ev.pd) / 7
    ); */

    res.render("evempleado", ev);
  } catch (error) {
    // console.log(error);
    res.render("evempleadoerror");
  }
};

//Lo mismo que index pero para la interfaz
controller.evaQnaJson = async (req, res) => {
  try {
    const { qna, mes, ano } = req.query;
    const { idEmpleado } = req.params;
    const empleado = await empM.findOne(idEmpleado);
    const hoy = new Date();
    let qnaD = qna ? qna : hoy.getDate() > 15 ? 2 : 1;
    let mesD = mes ? mes : hoy.getMonth() + 1;
    let anoD = ano ? ano : hoy.getFullYear();
    const { anoA, mesA, qnaA } = calcularQnaAn(
      qnaD,
      mesD,
      anoD,
      tiempoDB(empleado[0].fecha_registro)
    );

    const { anoS, mesS, qnaS } = calcularQnaSi(qnaD, mesD, anoD, tiempoDB(hoy));
    let diasMes = new Date(ano, mes, 0).getDate();
    let fechaInicio = `${anoD}-${mesD}-${qnaD >= 2 ? "16" : "01"}`;
    let fechaFinal = `${anoD}-${mesD}-${qnaD < 2 ? "15" : diasMes}`;

    const ev = await findEvaluaciones(
      fechaInicio,
      fechaFinal,
      empleado[0].idempleado,
      empleado,
      hoy
    );

    res.status(200).json({
      success: true,
      response: ev,
      periodoSiguiente: {
        qna: qnaS,
        mes: mesS,
        ano: anoS,
      },
      periodoAnterior: {
        qna: qnaA,
        mes: mesA,
        ano: anoA,
      },
      periodoConsultado: {
        inicio: fechaInicio,
        final: fechaFinal,
      },
    });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

function calcularQnaSi(qna, mes, ano, date) {
  const limit = new Date(date);
  let mesLimit = limit.getMonth() + 1,
    anoLimit = limit.getFullYear(),
    qnaLimit = limit.getDate() > 15 ? 2 : 1;

  let anoN = Number(ano),
    mesN = Number(mes),
    qnaN = Number(qna),
    qnaS = qnaN <= 1 ? 2 : 1,
    mesS = qnaS > qnaN ? mesN : mesN + 1 > 12 ? 1 : mesN + 1,
    anoS = mesN >= 12 ? anoN + 1 : anoN;

  if (mesLimit <= mesS && anoLimit <= anoS && qnaLimit <= qnaS) {
    return {
      qnaS: null,
      mesS: null,
      anoS: null,
    };
  } else {
    return {
      qnaS,
      mesS,
      anoS,
    };
  }
}

function calcularQnaAn(qna, mes, ano, date) {
  const limit = new Date(date);
  let mesLimit = limit.getMonth() + 1,
    anoLimit = limit.getFullYear(),
    qnaLimit = limit.getDate() > 15 ? 2 : 1;

  let anoN = Number(ano),
    mesN = Number(mes),
    qnaN = Number(qna),
    qnaA = qnaN <= 1 ? 2 : 1,
    mesA = qnaA > qnaN ? (mesN - 1 <= 1 ? 12 : mesN - 1) : mesN,
    anoA = mesN <= 1 ? anoN - 1 : anoN;

  if (mesLimit >= mesA && anoLimit >= anoA && qnaLimit >= qnaA) {
    return {
      qnaA: null,
      mesA: null,
      anoA: null,
    };
  } else {
    return {
      qnaA,
      mesA,
      anoA,
    };
  }
}

async function findEvaluaciones(fechaI, fechaF, idEmpleado, empleado, hoy) {
  function qnas(a, b) {
    let an = new Date(a).getTime();
    let ne = new Date(b).getTime();

    let diff = an - ne;
    let dias = diff / (60 * 60 * 24 * 1000);
    let quincenas = dias / 15;
    return Math.round(quincenas);
  }

  let cantidad = qnas(hoy, tiempoDB(empleado[0].fecha_registro));

  const nEvaluaciones = [];

  let dia = new Date().getDate();
  let mes = new Date().getMonth() + 1;
  let anio = Number(new Date().getFullYear());

  for (let i = 0; i < cantidad; i++) {
    let qn = 15 * (i + 1);
    let today = new Date(new Date().setDate(hoy.getDate() - qn));
    dia = today.getDate();
    mes = today.getMonth() + 1;
    anio = Number(today.getFullYear());
    let ulDia = new Date(anio, mes, 0).getDate();
    if (dia > 15) {
      nEvaluaciones.push({
        qna: 2,
        year: anio,
        month: mes,
        fechaI: `${anio}-${mes}-01`,
        fechaF: `${anio}-${mes}-15`,
      });
    } else {
      nEvaluaciones.push({
        qna: 1,
        year: anio,
        month: mes,
        fechaI: `${anio}-${mes}-16`,
        fechaF: `${anio}-${mes}-${ulDia}`,
      });
    }
  }

  const mf = await mfM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const ck = await ckBM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const evu = await evUM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const pd = await pdM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const rd = await rdM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const oyl = await oyLM.findXMesXEmpleadoEv([fechaI, fechaF, idEmpleado]);
  const snc = await sncM.findXMesXEmpleadoEv([
    [10, 3, 6, 7, 11, 13],
    fechaI,
    fechaF,
    idEmpleado,
  ]);
  const sncTotales = await sncM.findXMesXEmpleadoEv([
    [0],
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
    sncOtras: Math.abs(snc.total),
    sncEvaluacion: sncTotales.total - Math.abs(snc.total),
    sncTotales: sncTotales.total,
    nombre: `${empleado[0].nombre} ${empleado[0].apellido_paterno} ${empleado[0].apellido_materno}`,
    idchecador: empleado[0].idchecador,
    NumQnasTotales: nEvaluaciones.length,
    departamento: empleado[0].departamento,
  };

  // ev.mfp = ev.mf > 0 ? 0.0 : 10.0;
  ev.ck = fn((ev.ck / 12) * 10) > 10 ? 10 : fn((ev.ck / 12) * 10);
  ev.ev = fn((ev.ev / evu.todo) * 10) || 0;
  ev.rd = fn((ev.rd / rd.todo) * 10) || 0;
  ev.oyl = fn((ev.oyl / oyl.todo) * 10) || 0;

  return ev;
}

export default controller;
