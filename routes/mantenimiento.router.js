import router from "express-promise-router";
import ot from "../controllers/mantenimiento/OrdenTrabajo.controller";
import at from "../controllers/mantenimiento/AreasTrabajo.controller";

const route = router();

//ordenes de trabajo
route.post("/ot-from-panic-btn", ot.crearOTFromPanicBtn);
route.post("/ordentrabajo/crear-solicitud", ot.crearOTSolicitud);
route.put("/ordentrabajo/realizar/:idOT", ot.realizarOT);
route.put("/ordentrabajo/finalizar/:idOT", ot.terminarOT);
route.put("/ordentrabajo/liberar/:idOT", ot.liberarOT);
route.get("/ordentrabajo/obtener", ot.obtenerOT);
route.put("/ordentrabajo/configurarPrecioOT", ot.configurarPrecio);

route.post("/areastrabajo/crear", at.crearAreaT);
route.get("/areastrabajo/obtener", at.obtenerAreaT);
route.put("/areastrabajo/editar/:idarea", at.editarArea);
route.delete("/areastrabajo/eliminar/:idarea", at.eliminarArea);

export default route;
