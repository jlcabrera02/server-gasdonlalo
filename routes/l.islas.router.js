import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";
import controlV from "../controllers/l.controlvolumetrico.controller";
import lecturas from "../controllers/l.lecturas.controller";
import horarios from "../controllers/l.horarios.controller";
import liquido from "../controllers/l.liquido.controller";
import codigoUso from "../controllers/l.codigoUso.controller";
import precio from "../controllers/l.preciogas.controller";
import efectivoT from "../controllers/l.efectivoTienda.controller";
import preliquidaciones from "../controllers/administrativo/preliquidaciones.controller";

const route = router();

route.get("/tienda/efectivo/obtener", efectivoT.obtenerEfectivoTienda);
route.get("/tienda/efectivo/reporte/obtener", efectivoT.obtenerReporte);
route.post("/tienda/efectivo", efectivoT.capturarEfectivoTienda);
route.put("/tienda/editar/:idefectivo", efectivoT.editarEfectivo);
route.delete("/tienda/eliminar/:idefectivo", efectivoT.eliminarEfectivo);

//Configuracion de bombas
route.get("/islas/:idEstacion", islas.findIslas); //
route.post("/islas/insertar", islas.insertIslas); //
route.delete("/islas/eliminar/:idIsla", islas.eliminarIsla); //
route.put("/islas/habilitar/mangueras", islas.updateMangueras); //
route.put("/islas/edit/:idIsla", islas.updateIsla); //

//Control Volumetrico
route.get("/controlv/obtener", controlV.obtenerControlV); //
route.get("/controlv/comparaciones", controlV.comparacion); //
route.post("/controlv/insertar", controlV.capturarControlV); //
route.put("/controlv/editar/:idControl", controlV.editarControlV); //
route.delete("/controlv/eliminar/:idControl", controlV.eliminarControlV); //

//Lectura de bombas
route.get("/lectura/historial/:idEstacion", lecturas.historial); //
route.get("/lectura/inicial/:idEstacion", lecturas.lecturasIniciales); //
route.get("/lectura/inicialn/:idEstacion", lecturas.lecturasInicialesNew); //
route.get("/lectura/buscar/:idEstacion", lecturas.buscarLecturas); //
route.get("/infolecturas/:idEstacion", lecturas.buscarInfoLec); //
route.get("/jsonexcel", lecturas.jsonExcel); //
route.get("/reportes", lecturas.reportes); //
route.get("/infolecturasxLimit/:idEstacion", lecturas.buscarInfoLecLimit); //
route.post("/lecturasXIdempleado", lecturas.buscarLecturasXIdEmpleado);
route.put("/lectura/inicial", lecturas.updateLecturaInicial); //

//configuracion horarios
route.get("/horarios", horarios.obtenerHorario); //
route.post("/horarios/nuevo", horarios.nuevoHorario); //
route.put("/horarios/edit/:idHorario", horarios.actualizarHorario); //
route.delete("/horarios/delete/:idHorario", horarios.eliminarHorario); //

//captura de precios
route.get("/preciosCombustible/Historico", precio.obtenerPreciosHistoricos); //
route.get("/preciosCombustible", precio.obtenerPrecios); //
route.post("/preciosCombustible", precio.insertarPrecios); //
route.put("/preciosCombustible/edit/:idPrecio", precio.actualizarPrecios); //eliminarPrecios
route.delete("/preciosCombustible/eliminar", precio.eliminarPrecios); //eliminarPrecios

//Codigos de uso
route.get("/codigo-uso/obtener", codigoUso.obtenerCodigoUso); //
// route.get("/codigo-uso/reporte/obtener", efectivoT.obtenerReporte); //
route.post("/codigo-uso/nuevo", codigoUso.nuevoCodigoUso); //
route.put("/codigo-uso/editar/:idCodigoUso", codigoUso.editarCodigoUso); //
route.delete("/codigo-uso/eliminar/:idCodigoUso", codigoUso.eliminarCodigoUso); //
// --mantenimiento codigo de uso
route.get("/codigo-uso/mantenimiento", codigoUso.obtenerCodigoUsoMantenimiento);
route.post(
  "/codigo-uso/configurar-mantenimiento",
  codigoUso.configurarCUMantenimiento
);
route.delete(
  "/codigo-uso/eliminar-mantenimiento",
  codigoUso.eliminarCUMantenimiento
);

//Preliquidaciones
route.get("/preliquidaciones", preliquidaciones.buscarPreliquidaciones); //
route.put(
  "/preliquidaciones/editar/:idPreliquidacion",
  preliquidaciones.actualizarPreliquidacion
); //
route.delete(
  "/preliquidaciones/eliminar/:idPreliquidacion",
  preliquidaciones.eliminarPreliquidacion
); //
route.get("/buscar-preliquidacion", preliquidaciones.buscarPreliquidacion); //

//captura de liquidacion
route.post("/capturar", liquido.insertarLiquidos); //
route.get("/pendientes", liquido.liquidacionesPendientes); //
route.get("/folios/buscar", liquido.consultaFolios); //
route.get("/jarreo", liquido.acarreo); //
route.get("/inactivosMSMF", liquido.showMfMs);
route.get("/historial", liquido.consultarLiquidoHistorial); //
route.post("/reservar/:folio", liquido.reservarFolio); //
route.delete("/noreservar/:folio", liquido.quitarReservarFolio); //
route.put("/imprimir/:folio", liquido.imprimir); //
route.put("/update-show-mf-ms/:folio", liquido.administrarMfMs); //
route.put("/cancelar", liquido.cancelarLiquido); //

route.get("/capturados/:idliquidacion", liquido.consultarLiquido); //

route.get("/reporte-dashboard", liquido.reporteDashboard);
route.get("/reporte-ventas-dias", liquido.reporteVentasDias);

//pruebas
route.get("/prueba", liquido.prueba);

export default route;
