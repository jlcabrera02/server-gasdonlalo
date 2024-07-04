import modelos from "../../models";
import { Op } from "sequelize";

const { Actividades, FechasActividades, OT } = modelos;

export class Controller {
  modelo;
  modelosIncluir;
  constructor(modelo, modelosIncluir = []) {
    this.modelo = modelo;
    this.modelosIncluir = modelosIncluir;
  }

  obtenerTodos = async (req, res) => {
    const { fechaI, fechaF, dateProp, include, joinIndex, ...querys } =
      req.query;

    if (req.method === "POST") {
      console.log(req.body);
    }

    const filter = {};

    try {
      if (include && this.modelosIncluir.length > 0) {
        filter.include = JSON.parse(include).map((value, index) => {
          const { name, ...model } = this.modelosIncluir[value];
          if (joinIndex && Number(joinIndex) === index) {
            return {
              ...model,
              where: {
                [dateProp]: {
                  [Op.between]: [fechaI, fechaF],
                },
              },
            };
          }
          return model;
        });

        console.log(filter.include);
      } //permite incluir modelos a voluntad del usuario
      if (dateProp && fechaF && fechaI && !joinIndex) {
        filter.where = filter.hasOwnProperty("where")
          ? { ...filter.where, [dateProp]: { [Op.between]: [fechaI, fechaF] } }
          : { [dateProp]: { [Op.between]: [fechaI, fechaF] } };
      } //permite filtrar fechas
      if (Object.keys(querys).length > 0) {
        filter.where = filter.hasOwnProperty("where")
          ? { ...querys, ...filter.where }
          : querys;
      } //filtra por propiedades

      const response = await this.findAll(filter);

      return res.status(200).json({
        success: true,
        response,
        joinsAvaliable: this.modelosIncluir.map((el) => el.name),
      });
    } catch (err) {
      console.log(err.message);
      if (err instanceof TypeError) {
        res.status(400).json({ msg: "Join a incluir no identificado." });
      }
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente", err });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  obtenerUno = async (req, res) => {
    const querys = req.query;

    try {
      const response = await this.findAll(
        querys
          ? { where: querys, include: this.modelosIncluir }
          : { include: this.modelosIncluir }
      );

      return res.status(200).json({
        success: true,
        response,
      });
    } catch (err) {
      console.log(err);
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente", err });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  crear = async (req, res) => {
    const { body } = req;
    try {
      const response = await this.insertOne(body);

      return res.status(200).json({
        success: true,
        response,
      });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  actualizar = async (req, res) => {
    const { params, body } = req;
    try {
      const response = await this.update(body, params);

      return res.status(200).json({
        success: true,
        response,
      });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  eliminar = async (req, res) => {
    const { query } = req;

    console.log(query);
    try {
      const response = await this.deleteOne(query);

      return res.status(200).json({
        success: true,
        response,
      });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  //servicios
  findAll = async (querys) => {
    try {
      const response = await this.modelo.findAll(querys);

      return response;
    } catch (error) {
      throw error;
    }
  };

  findOne = async (querys) => {
    try {
      const response = await this.modelo.findOne(querys);

      return response;
    } catch (error) {
      throw error;
    }
  };
  insertOne = async (body) => {
    try {
      const response = await this.modelo.create(body);

      return response;
    } catch (error) {
      throw error;
    }
  };
  update = async (body, query) => {
    try {
      const response = await this.modelo.update(body, { where: query });

      return response;
    } catch (error) {
      throw error;
    }
  };
  deleteOne = async (query) => {
    try {
      const response = await this.modelo.destroy({ where: query });
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export const actividades = new Controller(Actividades, [
  { model: FechasActividades, name: "actividades" },
]);
export const fechas = new Controller(FechasActividades, [
  { model: OT, name: "ordenTrabajo" },
  { model: Actividades, as: "actividad", name: "actividades" },
]);
