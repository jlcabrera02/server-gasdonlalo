import { DataTypes } from "sequelize";
import sequelize from "../../config/configdb";

const SncNotification = sequelize.define(
  "sncacumuladas",
  {
    idsncacumuladas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idincumplimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capturado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

SncNotification.beforeCreate(async (record) => {
  const { idempleado, idincumplimiento, fecha } = record.dataValues;
  const exist = await SncNotification.findOne({
    where: { idempleado, fecha, idincumplimiento },
  });

  if (exist) {
    record.isNewRecord = false;
  }
});

export default SncNotification;
