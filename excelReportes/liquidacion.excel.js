import xl from "excel4node";
import models from "../models";
import { Op } from "sequelize";
import format from "../assets/formatTiempo";
import { buscarLecturasXIdEmpleado } from "../controllers/l.lecturas.controller";
const { Precios, empleados } = models;

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

    const convert = JSON.stringify(response);

    let reporte = JSON.parse(convert).map((el) => {
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

    const columnas = Object.keys(reporte[0]);
    columnas.forEach((c, i) => {
      ws.cell(1, i + 1)
        .string(c)
        .style(textHeader);
    });

    reporte.forEach((r, i) => {
      const columns = Object.keys(r);
      columns.forEach((c, j) => {
        const dato = r[c];
        if (typeof dato === "number") {
          ws.cell(i + 2, j + 1).number(dato);
        } else {
          const regExp = /\d\d\d\d-\d\d-\d\d/;
          if (regExp.test(dato)) {
            ws.cell(i + 2, j + 1).date(dato);
          } else {
            ws.cell(i + 2, j + 1).string(dato);
          }
        }
      });
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
    res.status(400).json({ success: false });
  }
};
