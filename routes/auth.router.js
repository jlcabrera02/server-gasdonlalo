import router from "express-promise-router";
import estacionService from "../controllers/auth.controller";

const route = router();

route.get("/", estacionService.validarTiempoSesion); //Me valida el tiempo en sesion
route.get("/usuarios/:idChecador", estacionService.findByIdEmpleado);
route.get("/usuarios", estacionService.findAll);
route.get("/permisos/:idChecador", estacionService.findPermisosXEmpleado);
route.get("/permisos", estacionService.findPermisos);
route.post("/login", estacionService.login);
route.post("/registrar/permiso", estacionService.registerPermisos);
route.post("/registrar", estacionService.register);
route.put("/changePass", estacionService.changePass);
route.put("/quitar/permiso", estacionService.quitarPermisos);

export default route;
