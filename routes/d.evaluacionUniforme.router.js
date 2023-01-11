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
// route.get(
//   "/verificar-evaluaciones-mes/:year/:month",
//   evaluacionUniforme.findPeriodoMensualEmpleadosXquincena
// );
route.get("/:id/:fecha", evaluacionUniforme.findOne);
route.post("/", evaluacionUniforme.insert);
route.put("/", evaluacionUniforme.update);
route.delete("/eliminar", evaluacionUniforme.delete);

export default route;
