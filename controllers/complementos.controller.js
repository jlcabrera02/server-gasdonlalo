import comM from "../models/complementos.model";

const controller = {};

controller.findOneById = async (req, res) => {
  try {
    const { table, idtext, id } = req.query;
    const data = { table, idtext, id };
    if (!idtext) delete data.idtext;
    let response = await comM.findOneById(data);
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
