import xl from "excel4node";
import models from "../models";
import { Op } from "sequelize";
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

export const LitrosVendidos = async (req, res) => {
  try {
  } catch (err) {}
};
