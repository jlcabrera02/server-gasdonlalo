import router from "express-promise-router";
import pasosDespachar from "../controllers/d.pasosDespachar.controller";

const route = router();

route.get(
  "/:year/:month/:idEmpleado/:quincena?",
  pasosDespachar.findEvaluacionesXEmpleado
);
route.get("/get-pasos", pasosDespachar.findPasos);
route.get("/:identificador", pasosDespachar.findOne);
route.post("/buscar", pasosDespachar.findEvaluacionesXTiempo);
route.post("/", pasosDespachar.insert);
route.put("/", pasosDespachar.update);
route.delete("/eliminar/:idEvaluacion/:longitud/:id", pasosDespachar.delete);

export default route;
