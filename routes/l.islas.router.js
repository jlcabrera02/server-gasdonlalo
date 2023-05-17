import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";
import lecturas from "../controllers/l.lecturas.controller";
import horarios from "../controllers/l.horarios.controller";
import liquido from "../controllers/l.liquido.controller";
import precio from "../controllers/l.preciogas.controller";

const route = router();

//Configuracion de bombas
route.get("/islas/:idEstacion", islas.findIslas);
route.post("/islas/insertar", islas.insertIslas);
route.put("/islas/habilitar/mangueras", islas.updateMangueras);
route.put("/islas/edit/:idIsla", islas.updateIsla);

//Lectura de bombas
route.get("/lectura/inicial/:idEstacion", lecturas.lecturasIniciales);
route.put("/lectura/inicial", lecturas.updateLecturaInicial);
// route.post("/lectura/final", lecturas.insertarLecturasFinales);

//configuracion horarios
route.get("/horarios", horarios.obtenerHorario);
route.post("/horarios/nuevo", horarios.nuevoHorario);
route.put("/horarios/edit/:idHorario", horarios.actualizarHorario);
route.delete("/horarios/delete/:idHorario", horarios.eliminarHorario);

//captura de precios
route.get("/preciosCombustible/Historico", precio.obtenerPreciosHistoricos);
route.get("/preciosCombustible", precio.obtenerPrecios);
route.post("/preciosCombustible", precio.insertarPrecios);
route.put("/preciosCombustible/edit/:idPrecio", precio.actualizarPrecios);

//captura de liquidacion
route.get("/pendientes", liquido.liquidacionesPendientes);
route.post("/capturar", liquido.insertarLiquidos);
route.post("/reservar/:folio", liquido.reservarFolio);
route.delete("/noreservar/:folio", liquido.quitarReservarFolio);

route.get("/capturados/:folio", liquido.consultarLiquido);

route.get("/prueba", liquido.prueba);

export default route;
