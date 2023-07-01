import path from "path";
import fs from "fs";

function scanDirs(directorio) {
  const data = [];
  try {
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
  } catch (err) {}
}

export function documentoPreliquidaciones(req, res) {
  const directorios = scanDirs(path.join(__dirname, "../documentos"));
  res.status(200).json(directorios);
}
