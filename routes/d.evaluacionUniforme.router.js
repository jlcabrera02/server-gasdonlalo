import router from "express-promise-router";
import evaluacionUniforme from "../controllers/d.evaluacionUniforme.controller";

const route = router();

route.get("/", evaluacionUniforme.find);
route.get("/get-pasos", evaluacionUniforme.findPasosEvUniforme);
route.get(
  "/periodo-mensual/:year/:month",
  evaluacionUniforme.findPeriodoMensual
);
route.get(
  "/periodo-mensual/:year/:month/:idEmpleado/",
  evaluacionUniforme.findPeriodoMensualEmpleados
);
route.get("/buscar/:identificador", evaluacionUniforme.findOne);

route.post("/buscar", evaluacionUniforme.findXTiempo);
route.post("/", evaluacionUniforme.insert);
route.put("/", evaluacionUniforme.update);
route.delete("/eliminar/:identificador", evaluacionUniforme.delete);

export default route;
