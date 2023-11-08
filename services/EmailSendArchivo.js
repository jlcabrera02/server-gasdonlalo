import nodemailer from "nodemailer";
import fs from "fs";
import temp from "../assets/formatTiempo";
import format from "../assets/formatTiempo";
import { config } from "dotenv";
import createPDF from "./PDFPreliquidacion";
import models from "../models/index";
const { diff, tiempoDB, tiempoHorario } = temp;
config();

const send = async ({ filename, content, text, subject, to }) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "gasdonlalo@gmail.com",
      //pass: "esadvtmxxcupqpxxel",
      pass: "eldcqwvwqbgindli",
    },
  };
  const msg = {
    from: "gasdonlalo@gmail.com",
    to: to || ["aj3amdua@gmail.com"],
    subject,
    text,
    attachments: [
      {
        filename,
        content: content.replace("data:application/pdf;base64,", ""),
        encoding: "base64",
      },
    ],
  };
  const transporter = nodemailer.createTransport(config);
  const sender = await transporter.sendMail(msg);
  return sender;
};

export const pdfArchivo = async (req, res) => {
  try {
    //Para guardar el documento PDF preliquidacion en el servidor junto con los datos a la BD
    const { data, otherData } = req.body;

    const { turno, empleado, estacionServicio, vales, efectivo } = otherData;

    const fechaLiquidacion = format.tiempoDB(new Date(), true);
    const ruta = process.env.RUTAFICHERO_PRELIQUIDACION;

    const rutaArchivo =
      ruta +
      `/preliquidacion_${
        empleado.nombre + empleado.apellido_paterno + empleado.apellido_materno
      }_${fechaLiquidacion.replaceAll("-", "")}_${turno.turno.replace(
        " ",
        ""
      )}_${estacionServicio.nombre.replace(" ", "")}.pdf`;

    const archivo = await createPDF({
      data,
      otherData,
    });

    const pdf = fs.createWriteStream(rutaArchivo);

    archivo.pipe(pdf);

    const { hora_empiezo, hora_termino } = turno;

    let diaMayor =
      Number(hora_empiezo.split(":")[0]) > Number(hora_termino.split(":")[0]);

    const horaDiff = diaMayor
      ? diff("2022-12-15", hora_termino) - diff("2022-12-14", hora_empiezo)
      : diff("2022-12-14", hora_termino) - diff("2022-12-14", hora_empiezo);

    const fecha = tiempoHorario(`${fechaLiquidacion} ${hora_termino}`);
    const fechaTurno = tiempoDB(new Date(fecha.getTime() - horaDiff));

    const response = await models.Preliquidaciones.create({
      lecturas: data.mangueras,
      vales,
      efectivo,
      idempleado: empleado.idempleado,
      idturno: turno.idturno,
      fechaturno: fechaTurno,
      fechaliquidacion: fechaLiquidacion,
      idestacion_servicio: estacionServicio.idestacion_servicio,
    });

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (err.errno === -2) {
      res.status(400).json({
        success: false,
        code: 400,
        msg: "No se encontró el directorio para almacenar el documento, porfavor, comunicate con los auxiliares de calidad e informales el problema",
      });
    } else {
      res.status(400).json({ err });
    }
  }
};
