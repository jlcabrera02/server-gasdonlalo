import xl from "excel4node";
import auth from "../models/auth.model";
import evUniM from "../models/d.evaluacionUniforme.model";
import pasosDM from "../models/d.pasosDespachar.model";
import empM from "../models/rh.empleado.model";
import path from "path";
import XLSX from "xlsx";
import formatTiempo from "../assets/formatTiempo";
const { formatMes } = formatTiempo;
const { verificar } = auth;

const controller = {};

const guardarArchivo = (req) =>
  new Promise((resolve, rejects) => {
    const archivo = req.files.dataReloj;

    const pathSave = path.join(
      __dirname,
      "../public/excel/",
      "relojChecador.xls"
    );

    archivo.mv(pathSave, (err) => {
      if (err) {
        rejects(err);
      } else {
        resolve(true);
      }
    });
  });

controller.relojChecador = async (req, res) => {
  try {
    await guardarArchivo(req)
      .then((res) => console.log(res))
      .catch((err) => {
        throw { code: 400, msg: "No se cargo bien el archivo", sucess: false };
      });

    let ap = path.join(__dirname, "../public/excel/relojChecador.xls");
    const excelJson = XLSX.readFile(ap);

    let nhoja = excelJson.SheetNames;
    const datos = XLSX.utils.sheet_to_json(excelJson.Sheets[nhoja[0]]);

    const response = datos.filter((el) => el.Estado === "Entrada");
    const mapear = [];
    for (let i = 0; i < response.length; i++) {
      const el = response[i];
      const fecha = el.Tiempo.match(/\d\d\/\d\d\/\d\d\d\d/);
      const tiempo = el.Tiempo.match(/\d\d\:\d\d\:\d\d/)[0].split(":");
      const formatoPm = el.Tiempo.match(/\w\. m\./)[0].includes("p");
      const [h, m, s] = tiempo;
      const fechaParse = fecha[0].split("/");
      const [dia, mes, ano] = fechaParse;
      const idChecador = Number(el["Número"]);

      const empleado = await empM.findByIdChecador(idChecador);

      const fechaParce = new Date(ano, mes - 1, dia, h, m, s);
      let fechaTiempo = formatTiempo.tiempoLocal(fechaParce);
      if (!formatoPm) {
        if (h === "12") {
          // fechaTiempo.setHours(fechaTiempo.getHours() - 24);
        } else {
          fechaTiempo.setHours(fechaTiempo.getHours() - 12);
        }
      }

      if (formatoPm && h === "12") {
        fechaTiempo.setHours(fechaTiempo.getHours() - 12);
      }
      // if (!formatoPm && h === "12") {
      //   console.log("hora");
      //   fechaTiempo.setHours(fechaTiempo.getHours() + 12);
      // }
      mapear.push({
        tiempoExcel: el.Tiempo,
        nombreCompleto: el.Nombre,
        fechaTiempo,
        idChecador,
        empleado,
        estado: el.Estado,
      });
    }

    let nuevo = mapear.map((el, i) => ({ ...el, index: i }));

    res.status(200).json(nuevo);
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

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
