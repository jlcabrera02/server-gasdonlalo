import xl from "excel4node";
import auth from "../models/auth.model";
import evUniM from "../models/d.evaluacionUniforme.model";
import pasosDM from "../models/d.pasosDespachar.model";
import empM from "../models/rh.empleado.model";
import formatTiempo from "../assets/formatTiempo";
import path from "path";
const { formatMes } = formatTiempo;
const { verificar } = auth;

const controller = {};

controller.createEvUniforme = async (req, res) => {
  try {
    // let user = verificar(req.headers.authorization);
    // if (!user.success) throw user;
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Evaluación uniforme");

    const datos = [];

    const despachadores = await empM.findEmpleadosXmesXiddepartamento(1);
    const { year, month } = req.params;
    const fecha = `${year}-${month}-01`;

    for (let i = 0; i < despachadores.length; i++) {
      const emp = despachadores[i];
      let cuerpo = [emp.idempleado, fecha, fecha];
      let evaluaciones = await evUniM.findPeriodoMensualEmpleado(cuerpo);
      datos.push({ empleado: despachadores[i], evaluaciones });
    }

    const title = wb.createStyle({
      font: {
        size: 15,
        bold: true,
      },
    });

    const column = wb.createStyle({
      font: {
        size: 12,
        bold: true,
      },
    });

    ws.column(3).setWidth(40);
    ws.column(4).setWidth(18);
    ws.column(5).setWidth(18);
    ws.cell(1, 3).string("GASOLINERIA DON LALO S.A. DE C.V.").style(title);
    ws.cell(2, 3).string("Evaluaciones uniforme de despacho").style(title);
    ws.cell(4, 5).string("Mes").style(column);
    ws.cell(4, 6).string(formatMes(fecha));
    ws.cell(6, 2).string("Id").style(column);
    ws.cell(6, 3).string("Despachador").style(column);
    ws.cell(6, 4).string("Puntos Evaluacion 1").style(column);
    ws.cell(6, 5).string("Puntos Evaluacion 2").style(column);
    ws.cell(6, 6).string("Total").style(column);

    for (let i = 0; i < datos.length; i++) {
      const emp = datos[i].empleado;
      const ev = datos[i].evaluaciones;
      const nombre = `${emp.nombre} ${emp.apellido_paterno} ${emp.apellido_materno}`;
      let ev1 =
        ev.length > 0
          ? ev.filter((el) => el.evNum === 1).length > 0
            ? ev.filter((el) => el.evNum === 1)[0].total
            : 0
          : 0;
      let ev2 =
        ev.length > 0
          ? ev.filter((el) => el.evNum === 2).length > 0
            ? ev.filter((el) => el.evNum === 2)[0].total
            : 0
          : 0;
      ws.cell(i + 7, 2).number(datos[i].empleado.idchecador);
      ws.cell(i + 7, 3).string(nombre);
      ws.cell(i + 7, 4).number(ev1);
      ws.cell(i + 7, 5).number(ev2);
      ws.cell(i + 7, 6).number(ev1 + ev2);
    }

    const pathExcel = path.join(
      __dirname,
      "../public/excel/evaluacionUniforme.xlsx"
    );

    wb.write(pathExcel, (err, stats) => {
      if (err) {
        console.log({ err });
      } else {
        console.log("Descargado");
        res.download(pathExcel);
        return false;
      }
    });

    // res.status(200).json({ success: true, response: "hola" });
  } catch (err) {
    console.log(err);
  }
};

controller.pasosDespachar = async (req, res) => {
  try {
    const { year, month } = req.params;
    const fecha = `${year}-${month}-01`;
    const despachadores = await empM.findEmpleadosXmesXiddepartamento(1);

    const response = [];

    for (let h = 0; h < despachadores.length; h++) {
      const emp = despachadores[h];
      console.log(emp);
      const identificador = await pasosDM.agruparEvaluaciones([
        Number(emp.idempleado),
        fecha,
      ]);
      const acumular = [];
      for (let i = 0; i < identificador.length; i++) {
        const pasos = await pasosDM.findEvaluacionesXEmpleado(
          identificador[i].identificador
        );
        if (pasos.length > 0) {
          let attach = {
            data: pasos,
            total: identificador[i].total,
            promedio: identificador[i].promedio,
            qna: identificador[i].quincena,
          };
          acumular.push({ empleado: emp, attach });
        }
      }
      response.push(acumular);
    }

    if (response.length < 1) throw sinRegistro();

    let filtrado = response.filter((el) => el.length > 0);

    res.status(200).json({ success: true, response: filtrado });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
