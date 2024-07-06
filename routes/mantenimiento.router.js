import router from "express-promise-router";
import ot from "../controllers/mantenimiento/OrdenTrabajo.controller";
import at from "../controllers/mantenimiento/AreasTrabajo.controller";
import {
  actividades,
  fechas,
} from "../controllers/mantenimiento/ProgramaMantenimiento";

const route = router();

//ordenes de trabajo
route.post("/ot-from-panic-btn", ot.crearOTFromPanicBtn);
route.get("/ordentrabajo/precioOT", ot.precioOT);
route.post("/ordentrabajo/crear-solicitud", ot.crearOTSolicitud);
route.post("/ordentrabajo/crear-ot", ot.crearOT);
route.put("/ordentrabajo/cancelar-realizar-ot/:idOT", ot.cancelarOT);
route.put("/ordentrabajo/realizar/:idOT", ot.realizarOT);
route.put("/ordentrabajo/finalizar/:idOT", ot.terminarOT);
route.put("/ordentrabajo/liberar/:idOT", ot.liberarOT);
route.get("/ordentrabajo/obtener", ot.obtenerOT);
route.get("/ordentrabajo/historial", ot.historialOT);
route.put("/ordentrabajo/configurarPrecioOT", ot.configurarPrecio);
route.delete("/ordentrabajo/eliminar/:idOT", ot.eliminarOT);

//Herramientas de trabajo
route.get("/herramientas/obtener", ot.obtenerUtencilios);
route.post("/herramientas/crear", ot.crearUtencilios);
route.put("/herramientas/editar/:idutencilio", ot.editarUtencilios);
route.delete("/herramientas/eliminar/:idutencilio", ot.eliminarUtencilios);

//Areas de trabajo
route.post("/areastrabajo/crear", at.crearAreaT);
route.get("/areastrabajo/obtener", at.obtenerAreaT);
route.put("/areastrabajo/editar/:idarea", at.editarArea);
route.delete("/areastrabajo/eliminar/:idarea", at.eliminarArea);

//programa de mantenimiento
route.get("/actividades", actividades.obtenerTodos);
route.post("/actividades", actividades.obtenerTodos);

route.post("/actividades/crear", actividades.crear);
route.put("/actividades/editar/:idactividad", (req, res) =>
  actividades.actualizar(req, res, ["nombre", "periodo_actividades"])
);
route.delete("/actividades/eliminar", actividades.eliminar);

route.get("/fechas-actividades", fechas.obtenerTodos);
route.get("/fechas-actividades/obtener-uno", fechas.obtenerUno);
route.post("/fechas-actividades/crear", fechas.crear);
route.put(
  "/fechas-actividades/editar/:idfechas_actividades",
  fechas.actualizar
);

export default route;
