import path from "path";
import fs from "fs";

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
