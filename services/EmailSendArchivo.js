import nodemailer from "nodemailer";
import fs from "fs";
import { config } from "dotenv";
import models from "../models";
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
      fechaTurno,
      idEstacionServicio,
    } = req.body;
    const ruta = process.env.RUTAFICHERO_PRELIQUIDACION;
    const rutaArchivo = ruta + "/" + req.body.filename;
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
      res.status(400).json({ err });
    }
  }
};

/* import PdfPrinter from "pdfmake";
import path from "path"; */
/*export const pdfLiquidacion = async (req, res) => {
  try {
    const dd = {
      content: [
        {
          text: "This is a header, using header style",
          style: "header",
        },
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n",
        {
          text: "Subheader 1 - using subheader style",
          style: "subheader",
        },
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n",
        {
          text: "Subheader 2 - using subheader style",
          style: "subheader",
        },
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n",
        {
          text: "It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties",
          style: ["quote", "small"],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 15,
          bold: true,
        },
        quote: {
          italics: true,
        },
        small: {
          fontSize: 8,
        },
      },
    };

    createPdfBinary(
      dd,
      function (binary) {
        res.contentType("application/pdf");
        res.send(binary);
      },
      function (error) {
        res.send("ERROR:" + error);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const createPdfBinary = (pdfDoc, callback) => {
  const fontDescriptors = {
    Roboto: {
      normal: path.join(__dirname, "..", "assets", "/fonts/Roboto-Regular.ttf"),
      bold: path.join(__dirname, "..", "assets", "/fonts/Roboto-Medium.ttf"),
      italics: path.join(__dirname, "..", "assets", "/fonts/Roboto-Italic.ttf"),
      bolditalics: path.join(
        __dirname,
        "..",
        "assets",
        "/fonts/Roboto-MediumItalic.ttf"
      ),
    },
  };
  const printer = new PdfPrinter(fontDescriptors);
  const doc = printer.createPdfKitDocument(pdfDoc);

  var chunks = [];
  var result;

  doc.on("data", function (chunk) {
    console.log(chunk);
    chunks.push(chunk);
  });
  doc.on("end", function () {
    result = Buffer.concat(chunks);
    callback("data:application/pdf;base64," + result.toString("base64"));
  });
  doc.end();
};
*/
