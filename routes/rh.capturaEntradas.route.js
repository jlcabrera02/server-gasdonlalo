import router from "express-promise-router";
import se from "../controllers/rh.capturaEntradas.controller";

const route = router();

// route.get("/", bomba.find);
route.get(
  "/obtenerxempleado/:year/:month/:idEmpleado",
  se.findEntradasXidEmpleadoXMes
);
route.get("/turnos", se.findTurnos);
route.get("/faltas", se.findFalta);
route.get("/semanas/:year/:month/", se.semanasXmes);
route.post("/buscar-capturas/:idEmpleado", se.findRetardosXsemanas);
route.post("/captura", se.insert);
route.post("/descanso", se.insertDescanso);
route.post("/turno", se.insertTurno);
route.put("/editar", se.update);
route.put("/editar/turno", se.updateTurno);
route.delete("/eliminar/:idCaptura", se.delete);
route.delete("/eliminar/turno/:idTurno", se.deleteTurno);

export default route;
