//Controlador General pensado para la reutilización y evitar lineas de codigós similares
import { Op } from "sequelize";
import models from "../models";

class Controlador {
  notAllowedFields;
  constructor(model, property = {}) {
    this.model = model;
    this.allowedIncludes = property.hasOwnProperty("allowedIncludes")
      ? property.allowedIncludes
      : []; // Relaciones permitidas
    this.allowedFilters = property.hasOwnProperty("allowedFilters")
      ? property.allowedFilters
      : []; // Filtros permitidos
    this.notAllowedFields = property.hasOwnProperty("notAllowedFields")
      ? property.notAllowedFields
      : []; // Campos no permitidos para create y update
    this.filtersFunction = property.hasOwnProperty("filtersFunction")
      ? property.filtersFunction
      : null; // Campos no permitidos para create y update
  }

  filterAndOptions = (req) => {
    const options = { include: [], where: {}, order: [] };

    // Aplicar filtros permitidos
    this.allowedFilters.forEach((f) => {
      const filter = req.query[f];
      if (filter) {
        if (Array.isArray(filter)) {
          if (filter === "null") {
            options.where[f] = null;
          } else {
            options.where[f] = filter;
          }
        } else {
          if (filter === "null") {
            options.where[f] = null;
          } else if (filter.startsWith("substring:")) {
            options.where[f] = {
              [Op.substring]: filter.split(":")[1],
            };
          } else {
            options.where[f] = filter;
          }
        }
      }
    });

    // Incluir relaciones permitidas
    if (req.query.includes) {
      const clearStr = req.query.includes.slice(1, -1);
      const dataInclude = clearStr.split(",");
      dataInclude.forEach((el) => {
        if (/:/.test(el)) {
          const separar = el.split(":");
          const model = Number(separar[0]);
          const asInclude = separar[1];
          options.include.push({
            model: models[this.allowedIncludes[model]],
            as: asInclude,
          });
        } else {
          const model = Number(el);
          options.include.push({
            model: models[this.allowedIncludes[model]],
          });
        }
      });
    }

    if (req.query.order) {
      const orderData = req.query.order;
      if (Array.isArray(orderData)) {
        orderData.forEach((ord) => {
          const split = ord.split(":");
          options.order.push([split[0], split[1]]);
        });
      } else {
        const split = orderData.split(":");
        options.order.push([split[0], split[1]]);
      }
    }

    /*  this.allowedIncludes.forEach((include) => {
      if (req.query.include && req.query.include.split(",").includes(include)) {
        options.include.push({
          model: models[include],
          as: include,
        });
      }
    }); */

    return options;
  };

  getAll = async (req, res) => {
    try {
      const options = this.filterAndOptions(req);
      console.log(options);

      const response = await this.model.findAll(options);

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

  getOne = async (req, res) => {
    try {
      const options = this.filterAndOptions(req);

      const response = await this.model.findOne(options);

      res.status(200).json({ success: true, response });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  getById = async (req, res) => {
    try {
      const response = await this.model.findByPk(req.params.id);

      res.status(200).json({ success: true, response });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  create = async (req, res) => {
    try {
      const data = {};
      //Permite hacer un filtrado de los campos que no se aceptaran ingresar
      const keysData = Object.keys(req.body);
      keysData.forEach((key) => {
        const exist = this.notAllowedFields.find((field) => field === key);
        if (!exist) {
          data[key] = req.body[key];
        }
      });

      const response = await this.model.create(data);

      res.status(201).json({ success: true, response });
    } catch (err) {
      console.log(err);

      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  update = async (req, res) => {
    try {
      const response = await this.model.findByPk(req.params.id);
      if (!response) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }

      const data = {};

      //Permite hacer un filtrado de los campos que no se aceptaran ingresar
      this.notAllowedFields.forEach((field) => {
        if (!req.body[field]) {
          data[field] = req.body[field];
        }
      });

      await response.update(data);

      res.status(200).json({ success: true, response });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };

  delete = async (req, res) => {
    try {
      const response = await this.model.findByPk(req.params.id);
      if (!response) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }

      await response.destroy();

      res.status(201).json({ success: true, response });
    } catch (err) {
      if (!err.code) {
        res.status(400).json({ msg: "datos no enviados correctamente" });
      } else {
        res.status(err.code).json(err);
      }
    }
  };
}

export default Controlador;
