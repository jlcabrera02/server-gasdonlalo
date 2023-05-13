import liqM from "../models/l.liquido.model";
import lecM from "../models/l.lecturas.model";
import horM from "../models/l.horarios.model";
import { insertLecturasFinales } from "../services/lecturasFinales";
// import { guardarBitacora } from "../models/auditorias";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
const { verificar } = auth;

const controller = {};

controller.insertarLiquidos = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { lecturas, vales, efectivo, folio } = req.body;
    const horario = await horM.obtenerHorarioById(folio);
    const fecha = formatTiempo.tiempoDB(horario.fechaliquidacion);
    if (lecturas.length < 1 || efectivo.length < 1) {
      throw {
        code: 400,
        msg: "No se están enviando los datos completos, corroborar las lecturas y captura de efectivos",
      };
    }

    const valesC = vales.map((el) => [
      el.monto,
      el.combustible,
      folio,
      el.folio,
    ]);

    const efectivosC = efectivo.map((el) => [el.monto, folio, el.folio]);

    const lecturasTable = lecturas.map((el) => [
      el.manguera,
      el.lecturaInicial,
      el.lecturaFinal,
      el.precioUnitario,
      folio,
    ]);

    const cuerpoLiquidacion = [
      {
        lecturas: JSON.stringify(lecturas),
        capturado: 1,
        idempleado_captura: user.token.data.datos.idempleado,
      },
      folio,
    ];
    if (valesC.length > 0) {
      await liqM.capturarVales(valesC);
    }

    await lecM.insertLecturas(lecturasTable);
    await liqM.capturarEfectivo(efectivosC);
    console.log("asds");

    // esta funcion insertar las lecturas iniciales para el siguiente turno
    await insertLecturasFinales(
      lecturas,
      horario.idestacion_servicio,
      fecha,
      folio
    );

    const response = await liqM.capturarFolio(cuerpoLiquidacion);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      console.log(err);
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

//Sirve para almacenar el folio de una liquidacion y evitar problemas de liquidaciones duplicadas
controller.reservarFolio = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;
    const { numero, total } = req.body;
    const idempleadoC = user.token.data.datos.idempleado;

    const cuerpo = [
      {
        capturado: 1,
        idempleado_captura: idempleadoC,
        paginacion: JSON.stringify({ numero, total }),
      },
      folio,
    ];

    console.log(cuerpo);

    const response = await liqM.capturarFolio(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.quitarReservarFolio = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { folio } = req.params;

    const cuerpo = [{ capturado: 0, idempleado_captura: null }, folio];

    const response = await liqM.capturarFolio(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.liquidacionesPendientes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { fecha } = req.query;
    const response = await liqM.liquidacionesPendientes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

export default controller;
