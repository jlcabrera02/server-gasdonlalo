import evaluacionUniformeM from "../models/d.evaluacionUniforme.model";
import { guardarBitacora } from "../models/auditorias";
import generadorId from "../assets/generadorId";
import empM from "../models/rh.empleado.model";
import auth from "../models/auth.model";
import formatTiempo from "../assets/formatTiempo";
import sncaM from "../models/s.acumular.model";
import models from "../models";
import { obtenerConfiguraciones } from "../services/configuracionesPersonalizables";
import EvUniforme, {
  CumplimientosUniforme,
} from "../models/despacho/EvUniforme.model";
import { Op } from "sequelize";
const { tiempoDB } = formatTiempo;
const { verificar } = auth;
const { SncNotification, empleados } = models;

const controller = {};
const area = "Evaluación Uniforme";

controller.obtenerEvaluacion = async (req, res) => {
  try {
    const { fechaI, fechaF, month, year, idEmpleado } = req.query;

    const filtros = {};

    if (fechaI && fechaF) {
      filtros.fecha = { [Op.between]: [fechaI, fechaF] };
    }

    if (idEmpleado) {
      const arrayEmpleados =
        typeof idEmpleado === "object" ? idEmpleado : [idEmpleado];
      console.log(idEmpleado);
      filtros.idempleado = arrayEmpleados;
    }

    if (year && month) {
      filtros[Op.and] = [
        ...(filtros[Op.and] || []),
        sequelize.where(sequelize.fn("MONTH", sequelize.col("fecha")), month),
        sequelize.where(sequelize.fn("year", sequelize.col("fecha")), year),
      ];
    }

    empleados.hasMany(EvUniforme, { foreignKey: "idempleado" });

    const response = await empleados.findAll({
      attributes: [
        "nombre",
        "idempleado",
        "idchecador",
        "apellido_paterno",
        "apellido_materno",
        "nombre_completo",
      ],

      include: {
        attributes: [
          "cumple",
          "identificador",
          "idevaluacion_uniforme",
          "fecha",
        ],
        model: EvUniforme,
        where: filtros,
        include: {
          model: CumplimientosUniforme,
          // attributes: ["cumplimiento", "idevaluacion_unfiroem"],
        },
      },
    });

    const puntajeMinimo =
      obtenerConfiguraciones().configDespacho.EvaluacionUniforme.puntajeMinimo;

    res.status(200).json({ success: true, response, puntajeMinimo });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findPasosEvUniforme = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    let response = await evaluacionUniformeM.findPasosEvUniforme();
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findEvaluacionMensual = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { year, month, idEmpleado } = req.params;
    const fecha = `${year}-${month}-01`;
    const cuerpo = [fecha, fecha];
    const cumplimientos = await evaluacionUniformeM.findPasosEvUniforme();
    let response = [];
    const getData = async (empleados, response, cuerpo, cumplimientos) => {
      const agrupar = {};
      const cantidad = [];
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        idempleado,
        idchecador,
      } = empleados;

      const data = await evaluacionUniformeM.findEvaluacionMensual(cuerpo);

      if (data.length > 0) {
        data.forEach((el) => {
          if (!agrupar.hasOwnProperty(el.identificador)) {
            agrupar[el.identificador] = [el];
          } else {
            agrupar[el.identificador].push(el);
          }
        });

        cumplimientos.forEach((el) => {
          const { cumplimiento, idcumplimiento_uniforme } = el;
          const cum = data.filter(
            (da) => da.idcumplimiento_uniforme === idcumplimiento_uniforme
          );

          const total = cum.length;

          const totalBuena = cum
            .map((el) => (el.cumple ? 1 : 0))
            .reduce((a, b) => a + b, 0);

          const totalMalas = total - totalBuena;
          cantidad.push({
            idcumplimiento_uniforme,
            cumplimiento,
            totalBuena,
            totalMalas,
            total,
          });
        });
      }

      let promedio = 0;
      const enlistar = Object.values(agrupar);

      if (cantidad.length > 0) {
        const total = cantidad.map((el) => el.total).reduce((a, b) => a + b);
        const totalBuenas = cantidad
          .map((el) => el.totalBuena)
          .reduce((a, b) => a + b);
        promedio = (totalBuenas * 10) / total;
      }

      response.push({
        idempleado,
        idchecador,
        nombre,
        apellido_paterno,
        apellido_materno,
        evaluaciones: enlistar,
        cantidad,
        promedio,
      });
    };

    if (!idEmpleado) {
      const empleados = await empM.findEmpleadosXmesXiddepartamento(1);

      for (let i = 0; i < empleados.length; i++) {
        let cuerpoNuevo = [...cuerpo, empleados[i].idempleado];
        await getData(empleados[i], response, cuerpoNuevo, cumplimientos);
      }
    } else {
      cuerpo.push(idEmpleado);
      const empleado = await empM.findOne(idEmpleado);
      await getData(empleado[0], response, cuerpo, cumplimientos);
    }

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findOne = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const response = await evaluacionUniformeM.findOne(identificador);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findXTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { idEmpleado } = req.body;
    const cuerpo = [Number(idEmpleado)];
    const response = await evaluacionUniformeM.findXTiempo(cuerpo);
    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insert = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 8);
    if (!user.success) throw user;
    const { empleado, fecha, evaluaciones } = req.body;
    const idGenerico = generadorId();
    const cuerpo = evaluaciones.map((el) => [
      fecha,
      Number(empleado),
      Number(el.idCumplimiento),
      2,
      Number(el.cumple),
      idGenerico,
    ]);

    const SNCvalidar = cuerpo.some((el) => el[4] === 0);
    if (SNCvalidar) {
      const sncNotificationFind =
        obtenerConfiguraciones().configSNC.sncacumuladas.find(
          (el) => el.notificacion === "Evaluación de uniforme"
        );

      const empleadoName = await empleados.findOne({
        attributes: [
          "nombre",
          "apellido_paterno",
          "apellido_materno",
          "nombre_completo",
        ],
        where: { idempleado: empleado },
      });

      const descripcion = sncNotificationFind.descripcion
        .replaceAll(
          `\$\{empleado\}`,
          JSON.parse(JSON.stringify(empleadoName)).nombre_completo.toLowerCase()
        )
        .replaceAll(`\$\{fecha\}`, formatTiempo.tiempoLocalShort(fecha));

      await SncNotification.create({
        idincumplimiento: sncNotificationFind.idincumplimiento,
        descripcion: descripcion,
        idempleado: empleado,
        fecha: fecha,
      });
    }

    //await evaluacionUniformeM.validarNoDuplicadoXQuincena(req.body); //validamos si existe un registro

    let response = await evaluacionUniformeM.insert(cuerpo);

    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      2,
      idGenerico,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res
        .status(400)
        .json({ success: false, msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.update = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 9);
    if (!user.success) throw user;
    const { empleado, evaluaciones } = req.body;

    const viejo = await evaluacionUniformeM.findByOne(
      evaluaciones[0].idEvaluacionUniforme
    );

    const viejoGroup = await evaluacionUniformeM.findOne(viejo.identificador);

    const cuerpo = evaluaciones.map((el) => [
      el.cumple,
      el.idEvaluacionUniforme,
      empleado,
    ]);

    const fecha = tiempoDB(viejo.fecha);

    const snca = await sncaM.validar([empleado, 11, fecha]);
    const correcto = viejoGroup.map((el) => el.cumple).includes(false);

    if (!correcto) {
      if (snca.length === 0) {
        const sncNotificationFind =
          obtenerConfiguraciones().configSNC.sncacumuladas.find(
            (el) => el.notificacion === "Evaluación de uniforme"
          );

        const empleadoName = await empleados.findOne({
          attributes: [
            "nombre",
            "apellido_paterno",
            "apellido_materno",
            "nombre_completo",
          ],
          where: { idempleado: empleado },
        });

        const descripcion = sncNotificationFind.descripcion
          .replaceAll(
            `\$\{empleado\}`,
            JSON.parse(
              JSON.stringify(empleadoName)
            ).nombre_completo.toLowerCase()
          )
          .replaceAll(`\$\{fecha\}`, formatTiempo.tiempoLocalShort(fecha));

        await SncNotification.create({
          idincumplimiento: sncNotificationFind.idincumplimiento,
          descripcion: descripcion,
          idempleado: empleado,
          fecha: fecha,
        });
      }
    } else {
      const SNCvalidar = cuerpo.map((el) => el[0]).includes(0);
      if (!SNCvalidar && snca.length > 0) {
        await sncaM.delete(snca[0].idsncacumuladas);
      }
    }
    let response = await evaluacionUniformeM.update(cuerpo);
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      3,
      viejo.identificador,
    ]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.delete = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 10);
    if (!user.success) throw user;
    const { identificador } = req.params;
    const viejo = await evaluacionUniformeM.findOne(identificador);
    let cuerpo = [viejo[0].idempleado, 11, tiempoDB(viejo[0].fecha)];
    const validar = await sncaM.validar(cuerpo);
    if (validar.length > 0) {
      await sncaM.delete(validar[0].idsncacumuladas);
    }

    let response = await evaluacionUniformeM.delete(identificador);
    await guardarBitacora([
      area,
      user.token.data.datos.idempleado,
      4,
      identificador,
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
