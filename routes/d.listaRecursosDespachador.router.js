import router from "express-promise-router";
import listaRecursosDespachador from "../controllers/d.listaRecursosDespachador.controller";

const route = router();

route.get("/:year/:month", listaRecursosDespachador.findListRecursosXmes);
route.get(
  "/:year/:month/:idEmpleado",
  listaRecursosDespachador.findListRecursosXmesXidEmpleado
);
route.get(
  "/quincena/:year/:month/:idEmpleado/:quincena",
  listaRecursosDespachador.findListRecursosXmesXidEmpleadoXquincena
);
route.get(
  "/empleados/:year/:month/:quincena",
  listaRecursosDespachador.findAllXQuicena
);
route.get("/get-recurso", listaRecursosDespachador.findRecursos);
route.post("/", listaRecursosDespachador.insert);
route.put("/:idRecurso", listaRecursosDespachador.update);
// route.delete(
//   "/eliminar/:idEvaluacion/:longitud/:id",
//   listaRecursosDespachador.delete
// );

export default route;
