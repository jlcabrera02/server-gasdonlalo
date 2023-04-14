import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";
import lecturas from "../controllers/l.lecturas.controller";

const route = router();

//Configuracion de bombas
route.get("/islas/:idEstacion", islas.findIslas);
route.post("/islas/insertar", islas.insertIslas);
route.put("/islas/habilitar/mangueras", islas.updateMangueras);
route.put("/islas/edit/:idIsla", islas.updateIsla);

//Lectura de bombas
route.get("/lectura/inicial/:idEstacion", lecturas.lecturasIniciales);
route.post("/lectura/final", lecturas.insertarLecturasFinales);

export default route;
