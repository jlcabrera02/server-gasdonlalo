import router from "express-promise-router";
import estacionService from "../controllers/auth.controller";

const route = router();

route.get("/usuarios", estacionService.findAll);
route.get("/permisos/:user", estacionService.findPermisosXEmpleado);
route.post("/login", estacionService.login);
route.post("/registrar/permiso", estacionService.registerPermisos);
route.post("/registrar", estacionService.register);
route.put("/quitar/permiso", estacionService.quitarPermisos);

export default route;
