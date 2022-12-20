import router from "express-promise-router";
import listaRecursosDespachador from "../controllers/listaRecursosDespachador.controller";

const route = router();

// route.get(
//   "/:year/:month/:quincena/:id",
//   listaRecursosDespachador.findEvaluacionesXempleado
// );
route.get("/get-recurso", listaRecursosDespachador.findRecursos);
route.post("/", listaRecursosDespachador.insert);
// route.put("/:idEvaluacion", listaRecursosDespachador.update);
// route.delete(
//   "/eliminar/:idEvaluacion/:longitud/:id",
//   listaRecursosDespachador.delete
// );

export default route;
