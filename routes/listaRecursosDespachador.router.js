import router from "express-promise-router";
import listaRecursosDespachador from "../controllers/listaRecursosDespachador.controller";

const route = router();

route.get("/:year/:month", listaRecursosDespachador.findListRecursosXmes);
route.get(
  "/:year/:month/:id",
  listaRecursosDespachador.findListRecursosXmesXidEmpleado
);
route.get("/get-recurso", listaRecursosDespachador.findRecursos);
route.post("/", listaRecursosDespachador.insert);
route.put("/:idRecurso", listaRecursosDespachador.update);
// route.delete(
//   "/eliminar/:idEvaluacion/:longitud/:id",
//   listaRecursosDespachador.delete
// );

export default route;
