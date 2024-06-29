import router from "express-promise-router";
import controlador from "../../controllers/pronosticos/pronosticos.controller";
const {
  obtenerPronosticosXcombustible,
  obtenerPronosticosXES,
  pruebas,
  guardarPronostico,
  guardarPedidos,
  obtenerPedidos,
  notificarPedidos,
  eliminarPedidos,
  editarPedidos,
  antesEigualDe,
  editarPronostico,
} = controlador;
const route = router();

route.get("/registrosXcombustible", obtenerPronosticosXcombustible);
route.get("/registrosXES", obtenerPronosticosXES);
route.get("/pedidos/obtener", obtenerPedidos);
route.get("/antesEigualDe/", antesEigualDe);

route.post("/guardar", guardarPronostico);
route.post("/pedidos/guardar", guardarPedidos);

route.put("/pedidos/notificar/:idpedidos", notificarPedidos);
route.put("/pedidos/editar/:idpedidos", editarPedidos);
route.put("/editar", editarPronostico);
route.post("/pruebas", pruebas);

route.delete("/pedidos/eliminar/:idpedidos", eliminarPedidos);

export default route;
