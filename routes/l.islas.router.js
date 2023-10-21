import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";
import lecturas from "../controllers/l.lecturas.controller";
import horarios from "../controllers/l.horarios.controller";
import liquido from "../controllers/l.liquido.controller";
import precio from "../controllers/l.preciogas.controller";
import preliquidaciones from "../controllers/administrativo/preliquidaciones.controller";

const route = router();

//Configuracion de bombas
route.get("/islas/:idEstacion", islas.findIslas); //
route.post("/islas/insertar", islas.insertIslas); //
route.delete("/islas/eliminar/:idIsla", islas.eliminarIsla); //
route.put("/islas/habilitar/mangueras", islas.updateMangueras); //
route.put("/islas/edit/:idIsla", islas.updateIsla); //

//Lectura de bombas
route.get("/lectura/inicial/:idEstacion", lecturas.lecturasIniciales); //
route.get("/lectura/buscar/:idEstacion", lecturas.buscarLecturas); //
route.get("/infolecturas/:idEstacion", lecturas.buscarInfoLec); //
route.get("/jsonexcel", lecturas.jsonExcel);
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

//captura de liquidacion
route.post("/capturar", liquido.insertarLiquidos); //
route.get("/pendientes", liquido.liquidacionesPendientes); //
route.get("/buscar-preliquidacion", preliquidaciones.buscarPreliquidacion); //
route.get("/historial", liquido.consultarLiquidoHistorial); //
route.post("/reservar/:folio", liquido.reservarFolio); //
route.delete("/noreservar/:folio", liquido.quitarReservarFolio); //
route.put("/cancelar", liquido.cancelarLiquido); //

route.get("/capturados/:idliquidacion", liquido.consultarLiquido); //

export default route;
