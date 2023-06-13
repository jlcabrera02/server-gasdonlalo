import empM from "../models/rh.empleado.model";
import path from "path";
import XLSX from "xlsx";
import formatTiempo from "../assets/formatTiempo";

const controller = {};

const guardarArchivo = (req) =>
  new Promise((resolve, rejects) => {
    const archivo = req.files.dataReloj;

    const pathSave = path.join(
      __dirname,
      "../public/excel/",
      "relojChecador.xls"
    );

    archivo.mv(pathSave, (err) => {
      if (err) {
        rejects(err);
      } else {
        resolve(true);
      }
    });
  });

controller.relojChecador = async (req, res) => {
  try {
    await guardarArchivo(req)
      .then((res) => console.log(res))
      .catch((err) => {
        throw { code: 400, msg: "No se cargo bien el archivo", sucess: false };
      });

    let ap = path.join(__dirname, "../public/excel/relojChecador.xls");
    const excelJson = XLSX.readFile(ap);

    let nhoja = excelJson.SheetNames;
    const datos = XLSX.utils.sheet_to_json(excelJson.Sheets[nhoja[0]]);

    const response = datos.filter((el) => el.Estado === "Entrada");
    const mapear = [];
    for (let i = 0; i < response.length; i++) {
      const el = response[i];
      const fecha = el.Tiempo.match(/\d\d\/\d\d\/\d\d\d\d/);
      const tiempo = el.Tiempo.match(/\d\d\:\d\d\:\d\d/)[0].split(":");
      const formatoPm = el.Tiempo.match(/\w\. m\./)[0].includes("p");
      const [h, m, s] = tiempo;
      const fechaParse = fecha[0].split("/");
      const [dia, mes, ano] = fechaParse;
      const idChecador = Number(el["Número"]);

      const empleado = await empM.findByIdChecador(idChecador);

      const fechaParce = new Date(ano, mes - 1, dia, h, m, s);
      let fechaTiempo = formatTiempo.tiempoLocal(fechaParce);
      if (!formatoPm) {
        if (h === "12") {
          // fechaTiempo.setHours(fechaTiempo.getHours() - 24);
        } else {
          fechaTiempo.setHours(fechaTiempo.getHours() - 12);
        }
      }

      if (formatoPm && h === "12") {
        fechaTiempo.setHours(fechaTiempo.getHours() - 12);
      }
      // if (!formatoPm && h === "12") {
      //   console.log("hora");
      //   fechaTiempo.setHours(fechaTiempo.getHours() + 12);
      // }
      mapear.push({
        tiempoExcel: el.Tiempo,
        nombreCompleto: el.Nombre,
        fechaTiempo,
        idChecador,
        empleado,
        estado: el.Estado,
      });
    }

    let nuevo = mapear.map((el, i) => ({ ...el, index: i }));

    res.status(200).json(nuevo);
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
