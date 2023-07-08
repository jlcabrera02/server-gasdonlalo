import path from "path";
import fs from "fs";
import { config } from "dotenv";
import { spawn } from "child_process";
config();

function scanDirs(directorio) {
  const data = [];
  const ls = fs.readdirSync(directorio);
  for (let i = 0; i < ls.length; i++) {
    const file = path.join(directorio, ls[i]);
    let datafile = null;
    try {
      datafile = fs.lstatSync(file);
    } catch (err) {}
    if (datafile) {
      data.push({
        path: file,
        isDirectory: datafile.isDirectory(),
        length: datafile.size,
      });
    }
    if (datafile.isDirectory()) {
      scanDirs(file);
    }
  }
  return data;
}

export function documentoPreliquidaciones(req, res) {
  try {
    const { pathClient } = req.query;
    const directorios = scanDirs(
      path.join(__dirname, "../documentos", pathClient || "")
    );
    res.status(200).json({ success: true, directorios });
  } catch (err) {
    console.log(err);
    res.status(400).json({ ...err, msg: "Directorio no encontrado" });
  }
}

export function backupdb(req, res) {
  const dumpFileName = `${Math.round(Date.now() / 1000)}.dump.sql`;
  const writeStream = fs.createWriteStream(
    path.join(__dirname, "../public/sistemaGDL/dumps", dumpFileName)
  );

  const dump = spawn("mysqldump", [
    "-u",
    process.env.USER_DB,
    `-p${process.env.PASSWORD_DB}`,
    "gasdonlalo",
  ]);

  dump.stdout
    .pipe(writeStream)
    .on("finish", function () {
      res
        .status(200)
        .json({ success: true, response: "Copia de seguridad guardada" });
    })
    .on("error", function (err) {
      res.status(400).json({
        success: false,
        response: "Error al generar copia de seguridad",
        err,
      });
    });
}
