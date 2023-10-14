import salidaNoCM from "../models/s.salidaNoConforme.model";
import { guardarBitacora } from "../models/auditorias";
import empleadoM from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import sncaM from "../models/s.acumular.model";
import fTiempo from "../assets/formatTiempo";
import respErro from "../respuestas/error.respuestas";
import model from "../models/index";
const { SNC } = model;
const { peticionImposible } = respErro;
const { tiempoDB } = fTiempo;
const { verificar } = auth;

const controller = {};

controller.buscarUnaSNCXDatos = async (req, res) => {
  try {
    const snc = await SNC.findOne({
      where: {
        idempleado: req.query.idEmpleado,
        idincumplimiento: req.query.idIncumplimiento,
        fecha: req.query.fecha,
      },
    });

    if (!snc)
      throw {
        success: false,
        msg: "No se encontro una similitud con los datos proporcionados",
        code: 404,
      };

    res.status(200).json({ success: true, response: snc });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "Error al obtener los datos", err });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findTotalSalidasXDiaXEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { fecha, idEmpleado } = req.params;
    const cuerpo = [idEmpleado, fecha];
    const response = await salidaNoCM.findTotalSalidasXDiaXEmpleado(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMes(fecha);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSNCPorCapturar = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { idDepartamento } = req.params;
    const response = await sncaM.find(idDepartamento);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMesPendientes = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSNCPendiente([fecha, fecha]);
    response.forEach((el) => {
      el.empleadoIncumple = {
        idempleado: el.idempleado,
        idchecador: el.idchecador,
        nombre: el.nombre,
        apellido_paterno: el.apellido_paterno,
        apellido_materno: el.apellido_materno,
      };
      el.empleadoAutoriza = {
        idempleado: el.idempleado_autoriza,
        idchecador: el.idchecadora,
        nombre: el.nombrea,
        apellido_paterno: el.apellidopa,
        apellido_materno: el.apellidoma,
      };

      delete el.idempleado;
      delete el.idempleado_autoriza;
      delete el.nombre;
      delete el.apellido_paterno;
      delete el.apellido_materno;
      delete el.idempleado_autoriza;
      delete el.nombrea;
      delete el.apellidopa;
      delete el.apellidoma;
    });
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasNoConformesXMesXIddepartamento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const response = await salidaNoCM.findSalidasNoConformesXMesXIddepartamento(
      fecha,
      iddepartamento
    );
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSNCXIncumplimiento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const empleados = await empleadoM.findEmpleadosXmesXiddepartamento(
      iddepartamento
    );

    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      const {
        idempleado,
        nombre,
        apellido_materno,
        apellido_paterno,
        idcheador,
      } = empleados[i];
      const incumplimientos = await salidaNoCM.findSNCXIncumplimiento([
        idempleado,
        fecha,
        fecha,
      ]);

      const total = incumplimientos
        .map((el) => el.total)
        .reduce((a, b) => a + b, 0);
      response.push({
        idempleado: idempleado,
        idchecador: idcheador,
        empleado: `${nombre} ${apellido_paterno} ${apellido_materno}`,
        totalSNC: total,
        incumplimientos,
      });
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasXInconformidadXMesXiddepartemento = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month, iddepartamento } = req.params;
    let fecha = `${year}-${month}-01`;
    const response =
      await salidaNoCM.findSalidasXInconformidadXMesXiddepartemento([
        fecha,
        fecha,
        iddepartamento,
      ]);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findSalidasXSemana = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { year, month, idSalida } = req.params;
    const fecha = `${year}-${month}-01`;
    let diasDelMes = new Date(year, month, 0).getDate(); //Me obtiene el numero de dias del mes
    let numSemana = diasDelMes / 7 > 4 ? 5 : 4; //Me obtiene cuantas semanas tiene el mes
    let empleados = await empleadoM.findEmpleadosXmesXiddepartamento([
      1,
      fecha,
    ]);
    let acumulador = [];
    for (let i = 0; i < empleados.length; i++) {
      let semanas = [];
      let iterador = 1;
      for (let j = 0; j < numSemana; j++) {
        if (iterador + 6 > diasDelMes) {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${diasDelMes}`;
          let response = await salidaNoCM.findSalidasXSemanaXidEmpleado([
            empleados[i].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: j + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            nombre_completo: empleados[i].nombre_completo,
            total: response.length > 0 ? response[0].total : 0,
          });
        } else {
          let firstFecha = `${year}-${month}-${iterador}`;
          let lasFecha = `${year}-${month}-${iterador + 6}`;
          let response = await salidaNoCM.findSalidasXSemanaXidEmpleado([
            empleados[i].idempleado,
            firstFecha,
            lasFecha,
          ]);
          semanas.push({
            semana: j + 1,
            diaEmpiezo: firstFecha,
            diaTermino: lasFecha,
            nombre_completo: empleados[i].nombre_completo,
            total: response.length > 0 ? response[0].total : 0,
          });
        }
        iterador = iterador + 7;
      }
      acumulador.push(semanas);
    }
    res.status(200).json({ success: true, response: acumulador });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findByEmpleado = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { idChecador } = req.params;
    const { fechaI, fechaF } = req.query;
    let sncs = [];
    const empleado = await empleadoM.findByIdChecador(idChecador);
    if (fechaI && fechaF) {
      sncs = await salidaNoCM.findByEmpleadoXfecha([
        empleado.idempleado,
        fechaI,
        fechaF,
      ]);
    } else {
      sncs = await salidaNoCM.findByEmpleado(empleado.idempleado);
    }

    for (let i = 0; i < sncs.length; i++) {
      const { idempleado_autoriza, concesiones, acciones_corregir } = sncs[i];
      sncs[i].empleado = empleado;
      if (!concesiones && !acciones_corregir) {
        sncs[i].empleadoAutoriza = null;
      } else {
        const empleadoAutoriza = await empleadoM.findOne(idempleado_autoriza);
        sncs[i].empleadoAutoriza = empleadoAutoriza[0];
      }
    }

    res.status(200).json({ success: true, response: sncs });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findOne = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const { idSalida } = req.params;
    const response = await salidaNoCM.findOne(idSalida);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 20);
    if (!user.success) throw user;
    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idIncumplimiento,
    } = req.body;

    if (!descripcionFalla) {
      throw peticionImposible("La descripción de la falla esta vacio");
    }

    const cuerpo = {
      fecha,
      descripcion_falla: descripcionFalla,
      acciones_corregir: accionesCorregir || null,
      concesiones: concesiones || null,
      idempleado: Number(idEmpleadoIncumple),
      idempleado_autoriza: Number(user.token.data.datos.idempleado),
      idincumplimiento: Number(idIncumplimiento),
    };

    //obtiene la SNC que se formo pero no se ha redactado.
    const SNCPendiente = await sncaM.validar([
      idEmpleadoIncumple,
      idIncumplimiento,
      fecha,
    ]);

    if (SNCPendiente.length > 0) {
      await sncaM.update([{ capturado: 1 }, SNCPendiente[0].idsncacumuladas]);
    }

    let response = await salidaNoCM.insert(cuerpo);

    await guardarBitacora([
      "SNC",
      user.token.data.datos.idempleado,
      2,
      response.insertId,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization);
    if (!user.success) throw user;
    const { idSalidaNoConforme } = req.params;

    const {
      fecha,
      descripcionFalla,
      accionesCorregir,
      concesiones,
      idEmpleadoIncumple,
      idIncumplimiento,
      // idDepartamento,
    } = req.body;

    if (!descripcionFalla) {
      throw peticionImposible("La descripción de la falla esta vacio");
    }

    const viejo = await salidaNoCM.findOne(idSalidaNoConforme);
    const validarViejo = await sncaM.validar(
      [viejo[0].idempleado_incumple, viejo[0].idincumplimiento, viejo[0].fecha],
      1
    );

    const validar = await sncaM.validar([
      idEmpleadoIncumple,
      idIncumplimiento,
      fecha,
    ]);

    //A la hora de actualizar, si se encuentra una snc acumulada que la capture.
    if (validar.length > 0) {
      await sncaM.update([{ capturado: 1 }, validar[0].idsncacumuladas]);
    }

    //Si los cambios son totalmente diferentes a los anteriores entonces la snacumulada se pone en pendiente
    if (
      viejo[0].idempleado_incumple !== idEmpleadoIncumple ||
      viejo[0].idincumplimiento !== idIncumplimiento ||
      tiempoDB(viejo[0].fecha) !== tiempoDB(fecha)
    ) {
      if (validarViejo.length > 0) {
        if (
          validarViejo[0].idempleado !== idEmpleadoIncumple ||
          validarViejo[0].idincumplimiento !== idIncumplimiento ||
          validarViejo[0].fecha !== fecha
        ) {
          await sncaM.update([
            { capturado: 0 },
            validarViejo[0].idsncacumuladas,
          ]);
        }
      }
    }

    const cuerpo = [
      {
        fecha,
        descripcion_falla: descripcionFalla,
        acciones_corregir: accionesCorregir || null,
        concesiones: concesiones || null,
        idempleado: Number(idEmpleadoIncumple),
        idempleado_autoriza: Number(user.token.data.datos.idempleado),
        idincumplimiento: Number(idIncumplimiento),
      },
      Number(idSalidaNoConforme),
    ];

    let response = await salidaNoCM.update(cuerpo);
    await guardarBitacora([
      "SNC",
      user.token.data.datos.idempleado,
      3,
      idSalidaNoConforme,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 23);
    if (!user.success) throw user;
    const { idSalidaNoConforme } = req.params;
    let response = await salidaNoCM.delete(idSalidaNoConforme);
    await guardarBitacora([
      "SNC",
      user.token.data.datos.idempleado,
      4,
      idSalidaNoConforme,
    ]);
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
