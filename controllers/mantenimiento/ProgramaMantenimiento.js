import modelos from "../../models";

const { Actividades, FechasActividades } = modelos;

export class Controller {
  modelo;
  modeloIncluir;
  constructor(modelo, modeloIncluir = null) {
    this.modelo = modelo;
    this.modeloIncluir = modeloIncluir;
  }

  obtenerTodos = async (req, res) => {
    const querys = req.query;

    try {
      const response = await this.findAll(
        querys
          ? { where: querys, include: this.modeloIncluir }
          : { include: this.modeloIncluir }
      );

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
  //servicios
  findAll = async (querys, include) => {
    try {
      const response = await this.modelo.findAll(querys);

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
}

export const actividades = new Controller(Actividades, FechasActividades);
export const fechas = new Controller(FechasActividades);
