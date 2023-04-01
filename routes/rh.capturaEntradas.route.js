import router from "express-promise-router";
import se from "../controllers/rh.capturaEntradas.controller";

const route = router();

// route.get("/", bomba.find);
route.get(
  "/obtenerxempleado/:year/:month/:idEmpleado",
  se.findEntradasXidEmpleadoXMes
);
route.get("/faltas", se.findFalta);
route.get("/semanas/:year/:month/", se.semanasXmes);
route.post("/buscar-capturas/:idEmpleado", se.findRetardosXsemanas);
route.post("/captura", se.insert);
route.post("/descanso", se.insertDescanso);
route.put("/editar", se.update);
// route.delete("/:id", bomba.delete);

export default route;
