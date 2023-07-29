import xl from "excel4node";
import models from "../models";
import { Op } from "sequelize";
// import format from "../assets/formatTiempo";
import { buscarLecturasXIdEmpleado } from "../controllers/l.lecturas.controller";
// import Decimal from "decimal.js-light";
const {
  Precios,
  empleados,
  Efectivo,
  Vales,
  LecturasFinales,
  InfoLecturas,
  Mangueras,
  Islas,
  Horarios,
  Liquidaciones,
  Turnos,
  ES,
} = models;

const textHeader = {
  font: { size: 12, bold: false },
};

export const preciosCombustible = async (req, res) => {
  try {
    const { fechaI, fechaF } = req.query;
    const querys = {};
    if (fechaI && fechaF) querys.fecha = { [Op.between]: [fechaI, fechaF] };
    const precios = await Precios.findAll({ where: querys });
    const empleado = await empleados.findAll();
    const newPrecios = precios.map((p) => ({
      ...p.dataValues,
      combustible:
        p.idgas === "M" ? "Magna" : p.idgas === "D" ? "Disiel" : "Premium",
      empleado: empleado.find((el) => el.idempleado === p.idempleado_captura),
    }));
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Precios");

    ws.cell(1, 1).string("Id").style(textHeader);
    ws.cell(1, 2).string("Combustible").style(textHeader);
    ws.cell(1, 3).string("Precio").style(textHeader);
    ws.cell(1, 4).string("Fecha").style(textHeader);
    newPrecios.forEach((el, i) => {
      ws.cell(i + 2, 1).number(el.idprecio);
      ws.cell(i + 2, 2).string(el.combustible);
      ws.cell(i + 2, 3).string(el.precio);
      ws.cell(i + 2, 4)
        .date(el.fecha)
        .style({ format: "yyyy-mm-dd" });
    });
    wb.writeToBuffer().then((buf) => {
      res.writeHead(200, [
        [
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      ]);
      res.end(buf);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, msg: err });
  }
};

export const LitrosVendidosXIdempleado = async (req, res) => {
  try {
    const response = await buscarLecturasXIdEmpleado(req.body);
    const wb = new xl.Workbook();
    const liquidacion = wb.addWorksheet("Liquidaciones");
    const ws = wb.addWorksheet("Lecturas");
    const vale = wb.addWorksheet("vales");
    const efecivo = wb.addWorksheet("efectivo");
    // const generalS = wb.addWorksheet("general");

    const convert = JSON.parse(JSON.stringify(response));

    const liquidaciones = convert.map((el) => ({
      idLiquidacion: el.idliquidacion,
      idEmpleado: el.horario.idempleado,
      ["nombre completo"]: `${el.horario.empleado.nombre} ${el.horario.empleado.apellido_paterno} ${el.horario.empleado.apellido_materno}`,
      turno: el.horario.turno.turno,
      ["Estacion servicio"]: el.horario.estacion_servicio.nombre,
      ["Fecha Liquidacion"]: el.horario.fechaliquidacion,
    }));

    const datos = [];
    convert.forEach((el) => {
      const stack = [];
      const lecturasFinales = JSON.parse(el.lecturas);
      const data = {
        ["idEmpleado"]: el.horario.empleado.idchecador || "",
        ["idLiquidacion"]: el.idliquidacion,
        ["Nombres"]: el.horario.empleado.nombre,
        ["Apellido Paterno"]: el.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: el.horario.empleado.apellido_materno,
        ["Idmanguera"]: "",
        ["Estación Servicio"]: "null",
        ["Número isla"]: "",
        ["Posición"]: "",
        ["Idgas"]: "",
        ["Combustible"]: "null",
        ["Lectura Inicial"]: "",
        ["Lectura Final"]: "",
        ["Total Litros"]: 0,
        ["Turno"]: el.horario.turno.turno,
        ["Precio unitario"]: "",
        ["Importe"]: 0,
        ["Folio Vale"]: "",
        ["Combustible vale"]: "",
        ["Monto Vale"]: 0,
        ["Folio Efectivo"]: "",
        ["Monto Efectivo"]: 0,
        ["Fecha"]: el.horario.fechaturno,
        ["Estatus"]: el.cancelado ? "Cancelado" : "Activo",
        ["Motivo Cancelación"]: el.cancelado ? el.cancelado : "",
        ["Fecha Cancelacion"]: el.cancelado ? el.fechaCancelado : "",
      };

      lecturasFinales.forEach((l) => {
        const local = [];
        local["Idmanguera"] = l.idmangueraGenerico;
        local["Estación Servicio"] = el.horario.estacion_servicio.nombre;
        local["Número isla"] = el.idislas.find(
          (is) => is.idisla === l.idisla
        ).nisla;
        local["Posición"] = el.posicion || "ACTUALIZAR";
        local["Combustible"] = l.combustible;
        local["Idgas"] = l.idgas;
        local["Lectura Inicial"] = l.lecturaInicial;
        local["Lectura Final"] = l.lecturaFinal;
        local["Total Litros"] = l.litrosVendidos;
        local["Precio unitario"] = Number(l.precioUnitario);
        local["Importe"] = Number(l.importe);
        stack.push({ ...data, ...local });
      });

      el.vales.forEach((v) => {
        const local = [];
        data["Folio Vale"] = v.folio || "";
        data["Combustible vale"] = v.label;
        data["Monto Vale"] = Number(v.monto);

        stack.push({ ...data, ...local });
      });

      el.efectivos.forEach((f) => {
        const local = [];
        data["Folio Efectivo"] = f.folio || "";
        data["Monto Efectivo"] = Number(f.monto);

        stack.push({ ...data, ...local });
      });

      datos.push(...stack);
    });

    let reporte = convert.map((el) => {
      const lecturasFinales = JSON.parse(el.lecturas);
      return lecturasFinales.map((l) => ({
        ["idEmpleado"]: el.horario.empleado.idchecador,
        ["idLiquidacion"]: el.idliquidacion,
        ["Nombres"]: el.horario.empleado.nombre,
        ["Apellido Paterno"]: el.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: el.horario.empleado.apellido_materno,
        ["idManguera"]: l.idmangueraGenerico,
        ["Estación Servicio"]: el.horario.estacion_servicio.nombre,
        ["Número isla"]: el.idislas.find((is) => is.idisla === l.idisla).nisla,
        ["Idgas"]: l.manguera.idgas,
        ["Lectura Inicial"]: l.lecturaInicial,
        ["Lectura Final"]: l.lecturaFinal,
        ["Total Litros"]: l.litrosVendidos,
        ["Turno"]: el.horario.turno.turno,
        ["Precio unitario"]: l.precioUnitario,
        ["Importe"]: Number(l.importe),
        ["Fecha"]: el.horario.fechaliquidacion,
        ["Estatus"]: el.cancelado ? "Cancelado" : "Vigente",
        ["Motivo Cancelación"]: el.cancelado ? el.cancelado : "",
        ["Fecha Cancelacion"]: el.cancelado ? el.fechaCancelado : "",
      }));
    });

    let efectivos = convert.map((el) => {
      const efectivos = el.efectivos;
      return efectivos.map((efectivo) => ({
        ["idEmpleado"]: el.horario.empleado.idchecador,
        ["idLiquidacion"]: el.idliquidacion,
        ["Folio Efectivo"]: efectivo.folio || "",
        ["Nombres"]: el.horario.empleado.nombre,
        ["Apellido Paterno"]: el.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: el.horario.empleado.apellido_materno,
        ["Monto Efectivo"]: Number(efectivo.monto),
      }));
    });

    let vales = convert.map((el) => {
      const vales = el.vales;
      return vales.map((vale) => ({
        ["idEmpleado"]: el.horario.empleado.idchecador,
        ["idLiquidacion"]: el.idliquidacion,
        ["Folio Vales"]: vale.folio || "",
        ["Nombres"]: el.horario.empleado.nombre,
        ["Apellido Paterno"]: el.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: el.horario.empleado.apellido_materno,
        ["Monto Vales"]: Number(vale.monto),
      }));
    });

    reporte = reporte.flat();
    efectivos = efectivos.flat();
    vales = vales.flat();

    generadorTablasExcel(liquidaciones, liquidacion);
    generadorTablasExcel(reporte, ws);
    generadorTablasExcel(efectivos, efecivo);
    generadorTablasExcel(vales, vale);
    // generadorTablasExcel(datos, generalS);

    wb.writeToBuffer().then((buf) => {
      res.writeHead(200, [
        [
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      ]);
      res.end(buf);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

export const Liquidacion = async (req, res) => {
  try {
    const { idLiquidacion } = req.params;
    const wb = new xl.Workbook();
    const lecturas = wb.addWorksheet("Lecturas");
    const vales = wb.addWorksheet("Vales");
    const efectivos = wb.addWorksheet("Efectivos");

    LecturasFinales.belongsTo(InfoLecturas, { foreignKey: "idinfo_lectura" });
    InfoLecturas.hasMany(LecturasFinales, { foreignKey: "idinfo_lectura" });

    LecturasFinales.belongsTo(Mangueras, { foreignKey: "idmanguera" });
    Mangueras.hasMany(LecturasFinales, { foreignKey: "idmanguera" });

    Mangueras.belongsTo(Islas, { foreignKey: "idisla" });
    Islas.hasMany(Mangueras, { foreignKey: "idisla" });

    const querys = { idliquidacion: idLiquidacion };

    let lecturasD = await Liquidaciones.findOne({
      where: querys,
      include: [
        {
          model: Horarios,
          include: [{ model: empleados }, { model: Turnos }, { model: ES }],
        },
        {
          model: InfoLecturas,
          include: [
            {
              model: LecturasFinales,
              include: [{ model: Mangueras, include: Islas }],
            },
          ],
        },
        { model: Vales },
        { model: Efectivo },
      ],
    });

    lecturasD = JSON.parse(JSON.stringify(lecturasD));

    if (lecturasD.length === 0) {
      throw {
        success: false,
        code: 400,
        msg: "No se encontraron datos en el periodo de tiempo",
      };
    }

    const lecturasM = lecturasD.info_lectura.lecturas_finales.map((l) => {
      return {
        ["idEmpleado"]: lecturasD.horario.empleado.idchecador,
        ["idLiquidacion"]: lecturasD.idliquidacion,
        ["Nombres"]: lecturasD.horario.empleado.nombre,
        ["Apellido Paterno"]: lecturasD.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: lecturasD.horario.empleado.apellido_materno,
        ["idManguera"]:
          l.manguera.direccion === "iz"
            ? `${l.manguera.idgas}${l.manguera.isla.nisla * 2 - 1}`
            : `${l.manguera.idgas}${l.manguera.isla.nisla * 2}`,
        ["idIsla"]: l.manguera.idisla,
        ["IdEstacionServicio"]: l.manguera.isla.idestacion_servicio,
        ["idGas"]: l.manguera.idgas,
        ["Numero de isla"]: l.manguera.isla.nisla,
        ["Lectura Inicial"]: l.lecturai,
        ["Lectura Final"]: l.lecturaf,
        ["Total Litros"]:
          l.lecturaf >= l.lecturai
            ? l.lecturaf - l.lecturai
            : 9999999 - l.lecturai + l.lecturaf + 1,
        ["Turno"]: lecturasD.horario.turno.turno,
        ["Precio unitario"]: l.precio,
        ["Importe"]: Number(l.importe),
        ["Fecha"]: lecturasD.horario.fechaturno,
        ["Estatus"]: lecturasD.cancelado ? "Cancelado" : "Vigente",
        ["Motivo Cancelación"]: lecturasD.cancelado ? lecturasD.cancelado : "",
        ["Fecha Cancelacion"]: lecturasD.cancelado
          ? lecturasD.fechaCancelado
          : "",
      };
    });

    const efectivoM = lecturasD.efectivos.map((el) => {
      return {
        ["idEmpleado"]: lecturasD.horario.empleado.idchecador,
        ["idLiquidacion"]: lecturasD.idliquidacion,
        ["folio"]: el.folio,
        ["Nombres"]: lecturasD.horario.empleado.nombre,
        ["Apellido Paterno"]: lecturasD.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: lecturasD.horario.empleado.apellido_materno,
        ["Turno"]: lecturasD.horario.turno.turno,
        ["Monto"]: Number(el.monto),
        ["Fecha"]: lecturasD.horario.fechaliquidacion,
        ["Estatus"]: lecturasD.cancelado ? "Cancelado" : "Vigente",
      };
    });

    const valesM = lecturasD.vales.map((el) => {
      return {
        ["idEmpleado"]: lecturasD.horario.empleado.idchecador,
        ["idLiquidacion"]: lecturasD.idliquidacion,
        ["folio"]: el.folio,
        ["Nombres"]: lecturasD.horario.empleado.nombre,
        ["Apellido Paterno"]: lecturasD.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: lecturasD.horario.empleado.apellido_materno,
        ["Combustible"]: el.label,
        ["Turno"]: lecturasD.horario.turno.turno,
        ["Monto"]: Number(el.monto),
        ["Fecha"]: lecturasD.horario.fechaliquidacion,
        ["Estatus"]: lecturasD.cancelado ? "Cancelado" : "Vigente",
      };
    });

    generadorTablasExcel(lecturasM, lecturas);
    generadorTablasExcel(efectivoM, efectivos);
    generadorTablasExcel(valesM, vales);

    wb.writeToBuffer().then((buf) => {
      res.writeHead(200, [
        [
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      ]);
      res.end(buf);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

const generadorTablasExcel = (datos, sheet) => {
  const columnas = Object.keys(datos[0]);
  columnas.forEach((c, i) => {
    sheet
      .cell(1, i + 1)
      .string(c)
      .style(textHeader);
  });
  datos.forEach((r, i) => {
    const columns = Object.keys(r);
    columns.forEach((c, j) => {
      const dato = r[c];
      if (typeof dato === "number") {
        sheet.cell(i + 2, j + 1).number(dato);
      } else {
        const regExp = /\d\d\d\d-\d\d-\d\d/;

        if (regExp.test(dato)) {
          sheet.cell(i + 2, j + 1).date(dato);
        } else if (dato === "null") {
          sheet.cell(i + 2, j + 1).string();
        } else {
          sheet.cell(i + 2, j + 1).string(dato);
        }
      }
    });
  });

  return sheet;
};
