import router from "express-promise-router";
import pasosDespachar from "../controllers/d.pasosDespachar.controller";

const route = router();

route.get(
  "/quincenas/:year/:month/:idEmpleado",
  pasosDespachar.findPasosXQuincenaXidempleado
);
route.get(
  "/:year/:month/:quincena/:id",
  pasosDespachar.findEvaluacionesXempleado
);
route.get("/get-pasos", pasosDespachar.findPasos);
route.post("/", pasosDespachar.insert);
route.put("/:idEvaluacion", pasosDespachar.update);
route.delete("/eliminar/:idEvaluacion/:longitud/:id", pasosDespachar.delete);

export default route;
