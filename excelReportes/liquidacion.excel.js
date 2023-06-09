import xl from "excel4node";
import models from "../models";
import { Op } from "sequelize";
import format from "../assets/formatTiempo";
import { buscarLecturasXIdEmpleado } from "../controllers/l.lecturas.controller";
import Decimal from "decimal.js-light";
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
  font: { size: 12, bold: true },
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
    res.status(400).json({ status: false });
  }
};

export const LitrosVendidosXIdempleado = async (req, res) => {
  try {
    const response = await buscarLecturasXIdEmpleado(req.body);
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Litros por empleado");

    const convert = JSON.parse(JSON.stringify(response));

    console.log(convert);

    let reporte = convert.map((el) => {
      const lecturasFInales = el.info_lectura.lecturas_finales;
      return lecturasFInales.map((l) => ({
        ["idEmpleado"]: el.horario.empleado.idchecador,
        ["idLiquidacion"]: el.idliquidacion,
        ["Nombres"]: el.horario.empleado.nombre,
        ["Apellido Paterno"]: el.horario.empleado.apellido_paterno,
        ["Apellido Materno"]: el.horario.empleado.apellido_materno,
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
        ["Turno"]: el.horario.turno.turno,
        ["Precio unitario"]: format.formatDinero(l.precio),
        ["Importe"]: format.formatDinero(l.importe),
        ["Fecha"]: el.horario.fechaliquidacion,
        ["Estatus"]: el.cancelado ? "Cancelado" : "Activo",
        ["Motivo Cancelación"]: el.cancelado ? el.cancelado : "",
        ["Fecha Cancelacion"]: el.cancelado ? el.fechaCancelado : "",
      }));
    });
    reporte = reporte.flat();

    const info = [];

    reporte = await Promise.all(
      reporte.map(async (el) => {
        const filtrador = (d) => d.idLiquidacion === el.idLiquidacion;
        const existeInformacion = info.some(filtrador);
        if (existeInformacion) {
          const informacion = existeInformacion.find(filtrador);
          return { ...el, ...informacion };
        } else {
          const query = { idLiquidacion: el.idLiquidacion };
          const calcularTotal = (datos, propiedad) => {
            const cantidad =
              datos.length > 0
                ? datos
                    .map((el) => el[propiedad])
                    .reduce((a, b) =>
                      new Decimal(a).add(new Decimal(b).toNumber(), 0)
                    )
                : 0;
            return Number(cantidad);
          };

          const efectivos = await Efectivo.findAll({ raw: true, where: query });
          const vales = await Vales.findAll({ raw: true, where: query });

          const extraccion = {
            idLiquidacion: el.idLiquidacion,
            ["Pesos en vales"]: format.formatDinero(
              calcularTotal(vales, "monto")
            ),
            ["Pesos en efectivo"]: format.formatDinero(
              calcularTotal(efectivos, "monto")
            ),
          };

          info.push(extraccion);
          return { ...el, ...extraccion };
        }
      })
    );

    generadorTablasExcel(reporte, ws);

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

    const query = { idliquidacion: idLiquidacion };

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

    console.log(lecturasD);

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
        ["Precio unitario"]: format.formatDinero(l.precio),
        ["Importe"]: format.formatDinero(l.importe),
        ["Fecha"]: lecturasD.horario.fechaliquidacion,
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
        ["Monto"]: format.formatDinero(el.monto),
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
        ["Monto"]: format.formatDinero(el.monto),
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
        } else {
          sheet.cell(i + 2, j + 1).string(dato);
        }
      }
    });
  });

  return sheet;
};
