import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const Proveedores = sequelize.define(
  "proveedores",
  {
    idproveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tipo_impacto: {
      type: DataTypes.ENUM("bajo", "alto", "unico"),
      allowNull: false,
    },
    tipo_servicio: {
      type: DataTypes.ENUM("bienes", "servicios", "combustibles"),
      allowNull: false,
    },
    nombre_contacto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numero_telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rfc: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    informacion_adicional: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    estatus: {
      type: DataTypes.ENUM("aprobado", "condicionado", "no aprobado"),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Proveedores;
