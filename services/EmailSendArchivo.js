import nodemailer from "nodemailer";
import fs from "fs";
import temp from "../assets/formatTiempo";
import estSerM from "../models/ad.estacionService.model";
import { config } from "dotenv";
import models from "../models";
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
    const {
      lecturas,
      vales,
      efectivo,
      idEmpleado,
      idTurno,
      fechaLiquidacion,
      idEstacionServicio,
    } = req.body;

    const ruta = process.env.RUTAFICHERO_PRELIQUIDACION;
    const rutaArchivo = ruta + "/" + req.body.filename;

    const turno = await estSerM.findTurnoById(idTurno);
    const { hora_empiezo, hora_termino } = turno;

    let diaMayor =
      Number(hora_empiezo.split(":")[0]) > Number(hora_termino.split(":")[0]);

    const horaDiff = diaMayor
      ? diff("2022-12-15", hora_termino) - diff("2022-12-14", hora_empiezo)
      : diff("2022-12-14", hora_termino) - diff("2022-12-14", hora_empiezo);

    const fecha = tiempoHorario(`${fechaLiquidacion} ${hora_termino}`);
    const fechaTurno = tiempoDB(new Date(fecha.getTime() - horaDiff));

    console.log(horaDiff, fecha);

    fs.writeFileSync(
      rutaArchivo,
      req.body.content.replace("data:application/pdf;base64,", ""),
      "base64",
      async (err, res) => {
        if (err) {
          throw {
            code: 400,
            msg: "Error al guardar documento intenta nuevamente",
            success: false,
          };
        }
      }
    );

    const response = await models.Preliquidaciones.create({
      lecturas,
      vales,
      efectivo,
      idempleado: idEmpleado,
      idturno: idTurno,
      fechaturno: fechaTurno,
      fechaliquidacion: fechaLiquidacion,
      idestacion_servicio: idEstacionServicio,
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
      console.log(err);
      res.status(400).json({ err });
    }
  }
};
