import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const OrdenTrabajo = sequelize.define(
  "ordenes_trabajo",
  {
    idorden_trabajo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_mantenimiento: {
      type: DataTypes.ENUM("Correctivo", "Preventivo"),
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_termino: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    descripcion_falla: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descripcion_trabajo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idestacion_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.ENUM(
        "solicitud",
        "realizando",
        "terminado",
        "liberado",
        "cancelado",
        "eliminado"
      ),
      allowNull: false,
      defaultValue: "solicitud",
    },
    herramientas: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    detalles_costo: {
      type: DataTypes.JSON, //herramientas:[{herramienta: costo}], tiempoTrabajo, costoPorHora, costoTotal
      allowNull: true,
    },
    idsolicitante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idpersonal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idliberante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipo_personal: {
      type: DataTypes.ENUM("Interno", "Externo"),
      allowNull: false,
      defaultValue: "Interno",
    },
    personal_externo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Personal Externo",
    },
  },
  {
    freezeTableName: true,
  }
);

export default OrdenTrabajo;
