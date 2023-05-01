import router from "express-promise-router";
import { buscarSNCXEmpleado } from "../../controllers/snc/snc.controller";
const route = router();

route.get("/sncXEmpleado/:idEmpleado", buscarSNCXEmpleado);

export default route;
