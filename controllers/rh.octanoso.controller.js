import octM from "../models/rh.octanoso.model";
import { guardarBitacora } from "../models/auditorias";
import empM from "../models/rh.empleado.model";
import salidaNCM from "../models/s.salidaNoConforme.model";
import formatTiempo from "../assets/formatTiempo";
import auth from "../models/auth.model";
import models from "../models";
import sequelize from "../config/configdb";
import agruparArr from "../assets/agrupar";
import { Op } from "sequelize";
import Decimal from "decimal.js-light";
const { Liquidaciones, Horarios, empleados, Vales } = models;
const { verificar } = auth;

const controller = {};
const area = "Concurso octanoso";

controller.find = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { month, year } = req.params;
    const fecha = `${year}-${month}-01`;
    const response = await octM.find([fecha, fecha]);

    res.status(200).json({ success: true, response });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.findVentasLXestacion = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month, idEstacionServicio } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const empleados = await octM.obtenerEmpleadosXRegistro([
      Number(idEstacionServicio),
      fecha,
      fecha,
    ]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let dat = [];
      for (let j = 1; j <= dias; j++) {
        let fecha = `${year}-${month}-${j}`;
        let cuerpo = [
          empleados[i].idempleado,
          Number(idEstacionServicio),
          fecha,
        ];
        const data = await octM.findVentasLXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          2,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
        } else {
          dat.push({
            idventa_litros: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados[i].idempleado,
            idestacion_servicio: Number(idEstacionServicio),
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: salida.total_salidas,
          });
        }
      }
      response.push({ empleado: empleados[i], datos: dat });
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

controller.findVentasL = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { year, month } = req.params;
    const dias = new Date(year, month, 0).getDate();
    const fecha = `${year}-${month}-01`;
    const empleados = await empM.findEmpleadosXmesXiddepartamento([1, fecha]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let data = [];
      let idempleado = empleados[i].idempleado;
      for (let j = 1; j <= dias; j++) {
        let fecha = `${year}-${month}-${j}`;
        let cuerpo = [idempleado, fecha];
        const venta = await octM.findVentasL(cuerpo);
        const totalSalidas = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          2,
        ]);
        if (venta.length > 0) {
          data.push({ ...venta[0], salidaNC: totalSalidas.total_salidas });
        } else {
          data.push({
            idventa_litros: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: idempleado,
            idestacion_servicio: null,
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: totalSalidas.total_salidas,
          });
        }
      }
      response.push({ empleados: empleados[i], data });
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

controller.findVentasLXestacionXIntervaloTiempo = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { fechaInicio, fechaFinal, idEstacionServicio } = req.body;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);
    const empleados = await octM.obtenerEmpleadosXRegistroXintervalo([
      Number(idEstacionServicio),
      fechaInicio,
      fechaFinal,
    ]);
    const response = [];

    for (let i = 0; i < empleados.length; i++) {
      let dat = [];
      let descalificado = false;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        let cuerpo = [
          empleados[i].idempleado,
          Number(idEstacionServicio),
          fecha,
        ];
        const data = await octM.findVentasLXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          empleados[i].idempleado,
          fecha,
          2,
        ]);
        if (data.length > 0) {
          dat.push({ ...data[0], salidaNC: salida.total_salidas });
          if (data[0].descalificado) descalificado = true;
        } else {
          dat.push({
            idventa_litros: null,
            fecha: new Date(fecha).toISOString(),
            idempleado: empleados[i].idempleado,
            idestacion_servicio: Number(idEstacionServicio),
            cantidad: 0,
            nombre: empleados[i].nombre,
            apellido_paterno: empleados[i].apellido_paterno,
            apellido_materno: empleados[i].apellido_materno,
            salidaNC: salida.total_salidas,
            descalificado: false,
          });
        }
      }
      response.push({ descalificado, empleado: empleados[i], datos: dat });
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

controller.octanosoC = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal, idEstacionServicio } = req.body;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);

    const codigosUsoMantenimiento = await Vales.findAll({
      where: { idcodigo_uso: ["C", "Z"] },
      include: [
        {
          model: Liquidaciones,
          attributes: ["idliquidacion", "lecturas", "idislas"],
          include: [
            {
              model: Horarios,
              attributes: [
                "idempleado",
                "fechaturno",
                "idturno",
                "fechaliquidacion",
                "idhorario",
                "idestacion_servicio",
              ],
              where: {
                fechaturno: { [Op.between]: [fechaInicio, fechaFinal] },
              },
            },
          ],
        },
      ],
    });

    const filtrarVacios = codigosUsoMantenimiento.filter(
      (el) => el.liquidacione
    );

    //Empleados que se encontraron en ese rango de fechas
    const liq = await Liquidaciones.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `JSON_ARRAYAGG(JSON_EXTRACT(JSON_UNQUOTE(lecturas), "$[*].litrosVendidos"))`
            ),
            "importes",
          ],
        ],
      },
      include: [
        {
          model: Horarios,
          where: {
            idestacion_servicio: idEstacionServicio,
            fechaturno: { [Op.between]: [fechaInicio, fechaFinal] },
          },
          include: empleados,
        },
      ],
      where: { cancelado: null },
      group: ["horario.idempleado", "horario.fechaturno"],
    });

    const liqParse = JSON.parse(JSON.stringify(liq));
    if (liqParse.length === 0) {
      throw {
        success: false,
        code: 400,
        msg: "No se encontraron registros en la Base de datos",
      };
    }
    //Agrupo por el id de los empleados para saber cuantos empleados estan involucrados
    const ids = agruparArr(liqParse, (el) => el.horario.idempleado).values();

    const response = [];

    for (let i = 0; i < ids.length; i++) {
      let dat = [];
      const { idempleado } = ids[i][0].horario;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        const data = liqParse.find(
          (liq) =>
            liq.horario.idempleado === idempleado &&
            liq.horario.fechaturno === fecha
        );
        // const data = await octM.findVentasLXestacion(cuerpo);
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          2, //Este es el id del concurso
        ]);

        const temp = {
          fecha,
          idempleado,
          idestacion_servicio: Number(idEstacionServicio),
          cantidad: 0,
          jarreosLitros: 0,
          salidaNC: salida.total_salidas,
        };

        if (data) {
          const jarreoExist = filtrarVacios.find(
            (jarreo) =>
              jarreo.dataValues.liquidacione.dataValues.idliquidacion ===
              ids[i][0].idliquidacion
          );

          if (jarreoExist) {
            const datos = JSON.parse(
              jarreoExist.dataValues.liquidacione.lecturas
            );
            const { monto } = jarreoExist.dataValues;
            const { precioUnitario } = datos.find(
              (d) => d.idgas === jarreoExist.combustible
            );

            temp.jarreosLitros = new Decimal(monto)
              .div(precioUnitario)
              .toNumber();
          }

          dat.push({
            ...temp,
            cantidad: data.importes.flat().reduce((a, b) => a + b, 0),
          });
        } else {
          dat.push(temp);
        }
      }

      response.push({
        empleado: ids[i][0].horario.empleado,
        datos: dat,
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

controller.octanosoAmbos = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.query;
    const diaI = formatTiempo.tiempoLocal(fechaInicio).getDate();
    const milisegundos =
      new Date(fechaFinal).getTime() - new Date(fechaInicio).getTime();
    const dias = milisegundos / (1000 * 60 * 60 * 24);

    const codigosUsoMantenimiento = await Vales.findAll({
      where: { idcodigo_uso: ["C", "Z"] },
      include: [
        {
          model: Liquidaciones,
          attributes: ["idliquidacion", "lecturas", "idislas"],
          include: [
            {
              model: Horarios,
              attributes: [
                "idempleado",
                "fechaturno",
                "idturno",
                "fechaliquidacion",
                "idhorario",
                "idestacion_servicio",
              ],
              where: {
                fechaturno: { [Op.between]: [fechaInicio, fechaFinal] },
              },
            },
          ],
        },
      ],
    });

    const filtrarVacios = codigosUsoMantenimiento.filter(
      (el) => el.liquidacione
    );

    //Empleados que se encontraron en ese rango de fechas
    const liq = await Liquidaciones.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `JSON_ARRAYAGG(JSON_EXTRACT(JSON_UNQUOTE(lecturas), "$[*].litrosVendidos"))`
            ),
            "importes",
          ],
        ],
      },
      include: [
        {
          model: Horarios,
          where: {
            fechaturno: { [Op.between]: [fechaInicio, fechaFinal] },
          },
          include: empleados,
        },
      ],
      where: { cancelado: null },
      group: ["horario.idempleado", "horario.fechaturno"],
    });

    const liqParse = JSON.parse(JSON.stringify(liq));
    if (liqParse.length === 0) {
      throw {
        success: false,
        code: 400,
        msg: "No se encontraron registros en la Base de datos",
      };
    }
    //Agrupo por el id de los empleados para saber cuantos empleados estan involucrados
    //ids1 = estacion1, ids2 = estacion2
    const ids1 = agruparArr(
      liqParse.filter((el) => el.horario.idestacion_servicio === 1),
      (el) => el.horario.idempleado
    ).values();

    const ids2 = agruparArr(
      liqParse.filter((el) => el.horario.idestacion_servicio === 2),
      (el) => el.horario.idempleado
    ).values();

    const estacion1 = [],
      estacion2 = [];

    for (let i = 0; i < ids1.length; i++) {
      let dat = [];
      const { idempleado } = ids1[i][0].horario;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        const data = liqParse.find(
          (liq) =>
            liq.horario.idempleado === idempleado &&
            liq.horario.fechaturno === fecha &&
            liq.horario.idestacion_servicio === 1
        );
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          2, //Este es el id del concurso
        ]);

        const temp = {
          fecha,
          idempleado,
          idestacion_servicio: 1,
          cantidad: 0,
          jarreosLitros: 0,
          salidaNC: salida.total_salidas,
        };

        if (data) {
          const jarreoExist = filtrarVacios.find(
            (jarreo) =>
              jarreo.dataValues.liquidacione.dataValues.idliquidacion ===
              ids1[i][0].idliquidacion
          );

          if (jarreoExist) {
            const datos = JSON.parse(
              jarreoExist.dataValues.liquidacione.lecturas
            );
            const { monto } = jarreoExist.dataValues;
            const { precioUnitario } = datos.find(
              (d) => d.idgas === jarreoExist.combustible
            );

            temp.jarreosLitros = new Decimal(monto)
              .div(precioUnitario)
              .toNumber();
          }

          dat.push({
            ...temp,
            cantidad: data.importes.flat().reduce((a, b) => a + b, 0),
          });
        } else {
          dat.push(temp);
        }
      }

      estacion1.push({
        empleado: ids1[i][0].horario.empleado,
        datos: dat,
      });
    }

    for (let i = 0; i < ids2.length; i++) {
      let dat = [];
      const { idempleado } = ids2[i][0].horario;
      for (let j = diaI; j <= dias + diaI; j++) {
        let fecha = new Date(
          new Date(formatTiempo.tiempoLocal(fechaInicio)).setDate(j)
        )
          .toISOString()
          .split("T")[0];
        const data = liqParse.find(
          (liq) =>
            liq.horario.idempleado === idempleado &&
            liq.horario.fechaturno === fecha &&
            liq.horario.idestacion_servicio === 2
        );
        const salida = await salidaNCM.findTotalSalidasXDiaXEmpleado([
          idempleado,
          fecha,
          2, //Este es el id del concurso
        ]);

        const temp = {
          fecha,
          idempleado,
          idestacion_servicio: 2,
          cantidad: 0,
          jarreosLitros: 0,
          salidaNC: salida.total_salidas,
        };

        if (data) {
          const jarreoExist = filtrarVacios.find(
            (jarreo) =>
              jarreo.dataValues.liquidacione.dataValues.idliquidacion ===
              ids2[i][0].idliquidacion
          );

          if (jarreoExist) {
            const datos = JSON.parse(
              jarreoExist.dataValues.liquidacione.lecturas
            );
            const { monto } = jarreoExist.dataValues;
            const { precioUnitario } = datos.find(
              (d) => d.idgas === jarreoExist.combustible
            );

            temp.jarreosLitros = new Decimal(monto)
              .div(precioUnitario)
              .toNumber();
          }

          dat.push({
            ...temp,
            cantidad: data.importes.flat().reduce((a, b) => a + b, 0),
          });
        } else {
          dat.push(temp);
        }
      }

      estacion2.push({
        empleado: ids2[i][0].horario.empleado,
        datos: dat,
      });
    }

    res.status(200).json({ success: true, estacion1, estacion2, liqParse });
  } catch (err) {
    if (!err.code) {
      res.status(400).json({ msg: "datos no enviados correctamente" });
    } else {
      res.status(err.code).json(err);
    }
  }
};

controller.insertVentaLitros = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const {
      idEmpleado,
      idEstacionServicio,
      litrosVendidos,
      fecha,
      descalificado,
    } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      idestacion_servicio: Number(idEstacionServicio),
      fecha: fecha,
      cantidad: litrosVendidos,
      descalificado: Number(descalificado),
    };

    await octM.validarNoDuplicacado([cuerpo.fecha, cuerpo.idempleado]);

    const response = await octM.insertVentaLitros(cuerpo);

    await guardarBitacora([
      area,
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

controller.updateLitros = async (req, res) => {
  try {
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idOct } = req.params;
    const {
      fecha,
      idEmpleado,
      idEstacionServicio,
      litrosVendidos,
      descalificado,
    } = req.body;

    const cuerpo = {
      idempleado: Number(idEmpleado),
      idestacion_servicio: Number(idEstacionServicio),
      fecha: fecha,
      cantidad: litrosVendidos,
      descalificado: Number(descalificado),
    };

    const response = await octM.updateLitros(cuerpo, idOct);

    await guardarBitacora([area, user.token.data.datos.idempleado, 3, idOct]);

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
    let user = verificar(req.headers.authorization, 24);
    if (!user.success) throw user;
    const { idOct } = req.params;

    const response = await octM.delete(idOct);

    await guardarBitacora([area, user.token.data.datos.idempleado, 4, idOct]);

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
