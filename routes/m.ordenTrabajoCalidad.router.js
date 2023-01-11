import router from "express-promise-router";
import ordenTrabajoCalidad from "../controllers/m.ordenTrabajoCalidad.controller";

const route = router();

route.get(
  "/:year/:month/:idEstacionServicio",
  ordenTrabajoCalidad.findOrdenTrabajoCalidadXEstacion
);

route.get(
  "/buscar-cantidad-tipo/:year/:month/:idEstacionServicio",
  ordenTrabajoCalidad.findTotalOTXMesXEstacion
);

route.get(
  "/buscar-mantenimiento/:year/:month/:idEstacionServicio/:idMantenimiento",
  ordenTrabajoCalidad.findTotaOTXMantenimiento
);

route.get(
  "/buscar-area/:year/:month/:idEstacionServicio/:idArea",
  ordenTrabajoCalidad.findTotaOTXDetalladaXArea
);

// route.get("/:id", ordenTrabajoCalidad.findOne);
route.post("/", ordenTrabajoCalidad.insert);
route.put("/:idOTrabajoCalidad", ordenTrabajoCalidad.update);
route.delete("/:idOTrabajoCalidad", ordenTrabajoCalidad.delete);

export default route;
