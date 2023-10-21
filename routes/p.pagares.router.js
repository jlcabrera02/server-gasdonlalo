import router from "express-promise-router";
import pagares from "../controllers/p.pagares.controller";

const route = router();

//Configuracion de bombas
route.get("/obtener/:idPagare", pagares.findPagare); //
route.get("/obtener", pagares.findPagares); //
route.post("/insertar", pagares.insertPagares); //
route.put("/actualizar/:idPagare", pagares.updatePagares); //
route.delete("/eliminar/:idPagare", pagares.deletePagares); //

export default route;
