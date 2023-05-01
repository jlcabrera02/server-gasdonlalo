import models from "../../models";
const { departamentos, Incumplimientos } = models;

export async function buscarIncumplimientos(req, res) {
  try {
    const { idDepartamento } = req.query;

    console.log(idDepartamento);

    let options = {
      include: [
        {
          model: departamentos,
        },
      ],
    };

    if (idDepartamento) {
      options.where = { iddepartamento: idDepartamento };
    }

    const response = await Incumplimientos.findAll(options);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      err,
      msg: "Error al obtener los incumplimientos",
    });
  }
}
