import router from "express-promise-router";
import listaRecursosDespachador from "../controllers/d.listaRecursosDespachador.controller";

const route = router();

/* route.get(
  "/:year/:month/:idEmpleado",
  listaRecursosDespachador.findListRecursosXmesXidEmpleado
  ); */
/*   route.get(
    "/quincena/:year/:month/:idEmpleado/:quincena",
    listaRecursosDespachador.findListRecursosXmesXidEmpleadoXquincena
    ); */
route.get(
  "/empleados/:year/:month",
  listaRecursosDespachador.findListRecursosXmes
);
route.get(
  "/empleados/:year/:month/:quincena",
  listaRecursosDespachador.findAllXQuicena
);
route.get("/get-recurso", listaRecursosDespachador.findRecursos);
route.get("/:identificador", listaRecursosDespachador.findByIdentificador);
route.post("/buscar", listaRecursosDespachador.findXTiempo);
route.post("/", listaRecursosDespachador.insert);
route.put("/", listaRecursosDespachador.update);
route.delete("/eliminar/:identificador", listaRecursosDespachador.delete);

export default route;
