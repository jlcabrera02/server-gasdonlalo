import sequelize from "../config/configdb";
import models from "../models";
import Controlador from "./controlador";
const { Proveedores, EvProveedores, ActProveedores, AtProveedores } = models;

const allowedIncludes = [
  "Proveedores",
  "EvProveedores",
  "ActProveedores",
  "AtProveedores",
];

class GuardarEv extends Controlador {
  guardarEvaluacion = async (req, res) => {
    try {
      const {
        evaluaciones,
        atenciones,
        calificacion,
        resultado,
        fecha,
        idproveedor,
        idempleado_evaluador,
      } = req.body;

      const response = await sequelize.transaction(async (t) => {
        const valoracionAct = [false, true];
        const valoracionAten = ["Deficiente", "Regular", "Excelente"];
        const evaluacion = await EvProveedores.create(
          {
            fecha,
            idproveedor,
            calificacion_obtenida: calificacion,
            resultado,
            idempleado_evaluador,
          },
          { transaction: t }
        );

        const actividadesEv = await ActProveedores.bulkCreate(
          evaluaciones.map((ev) => ({
            descripcion: ev.actividad,
            cumple:
              ev.valoracion !== null ? valoracionAct[ev.valoracion] : false,
            idevaluacion: evaluacion.idevaluacion,
          })),
          { transaction: t }
        );

        const atencionesEv = await AtProveedores.bulkCreate(
          atenciones.map((atc) => ({
            descripcion: atc.actividad,
            valoracion:
              atc.valoracion !== null
                ? valoracionAten[atc.valoracion]
                : valoracionAten[0],
            idevaluacion: evaluacion.idevaluacion,
          })),
          { transaction: t }
        );

        await Proveedores.update(
          { estatus: resultado },
          { where: { idproveedor }, transaction: t }
        );

        return {
          atenciones: atencionesEv,
          actividades: actividadesEv,
          evaluacion,
        };
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
}

const CEvaluaciones = new Controlador(models.EvProveedores, {
  allowedIncludes,
  allowedFilters: ["idproveedor"],
});

const CProveedores = new GuardarEv(models.Proveedores, {
  allowedFilters: ["estatus", "nombre", "tipo_servicio"],
  allowedIncludes,
});

export default { CProveedores, CEvaluaciones };
