import router from "express-promise-router";
import acumular from "../controllers/s.acumular.controller";

const route = router();
route.delete("/eliminar/:idSncacumulada", acumular.delete);

export default route;
