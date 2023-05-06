import router from "express-promise-router";
import {
  obtenerTurnos,
  crearTurno,
  actTurno,
  eliminarTurno,
} from "../../controllers/administrativo/turnos.controller";
const route = router();

route.post("/crear", crearTurno);
route.delete("/eliminar/:idTurno", eliminarTurno);
route.put("/edit/:idTurno", actTurno);
route.get("/buscarTodo", obtenerTurnos);

export default route;
