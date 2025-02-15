import router from "express-promise-router";
import controlador from "../../controllers/pronosticos/pronosticos.controller";
const {
  obtenerPronosticosXcombustible,
  obtenerPronosticosXES,
  obtenerConfigPronostico,
  escribirConfigPronostico,
  guardarPronostico,
  guardarPedidos,
  obtenerPedidos,
  notificarPedidos,
  eliminarPedidos,
  editarPedidos,
  editarInformacionPedidos,
  antesEigualDe,
  editarPronostico,
  obtenerReportesPedidos,
  consultar,
} = controlador;
const route = router();

route.get("/reportesPedidos", obtenerReportesPedidos);
route.get("/registrosXcombustible", obtenerPronosticosXcombustible);
route.get("/registrosXES", obtenerPronosticosXES);
route.get("/pedidos/obtener", obtenerPedidos);
route.get("/antesEigualDe/", antesEigualDe);
route.get("/configuraciones", obtenerConfigPronostico);
route.get("/consultar", consultar);

route.post("/guardar", guardarPronostico);
route.post("/pedidos/guardar", guardarPedidos);

route.put("/escribir/configuracion", escribirConfigPronostico);
route.put("/pedidos/notificar/:idpedidos", notificarPedidos);
route.put("/pedidos/editar/:idpedidos", editarPedidos);
route.put("/pedidos/editarinfo/:idpedidos", editarInformacionPedidos);
route.put("/editar", editarPronostico);

route.delete("/pedidos/eliminar/:idpedidos", eliminarPedidos);

export default route;
