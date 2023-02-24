import router from "express-promise-router";
import evaluacionUniforme from "../controllers/d.evaluacionUniforme.controller";

const route = router();

route.get("/get-pasos", evaluacionUniforme.findPasosEvUniforme);
route.get("/buscar/:identificador", evaluacionUniforme.findOne);
route.get(
  "/:year/:month/:idEmpleado?",
  evaluacionUniforme.findEvaluacionMensual
);

route.post("/buscar", evaluacionUniforme.findXTiempo);
route.post("/", evaluacionUniforme.insert);
route.put("/", evaluacionUniforme.update);
route.delete("/eliminar/:identificador", evaluacionUniforme.delete);

export default route;
