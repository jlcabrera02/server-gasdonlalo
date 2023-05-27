import router from "express-promise-router";
import estacionService from "../controllers/auth.controller";

const route = router();

route.get("/", estacionService.validarTiempoSesion); //Me valida el tiempo en sesion
route.get("/usuarios/:idChecador", estacionService.findByIdEmpleado);
route.get("/usuarios", estacionService.findAll);
route.get("/permisos/:idChecador", estacionService.findPermisosXEmpleado);
route.get("/permisos", estacionService.findPermisos);
route.get("/listAccessKey", estacionService.ListLlaveAcceso);
route.post("/accessKey", estacionService.AccessLlaveAcceso);
route.delete("/deleteAccessKey/:key", estacionService.RemoveLlaveAcceso);
route.post("/createAccessKey", estacionService.CreateLlaveAcceso);
route.post("/login", estacionService.login);
route.post("/registrar/permiso", estacionService.registerPermisos);
route.post("/registrar", estacionService.register);
route.put("/changePass", estacionService.changePass);
route.put("/changePassA", estacionService.changePassAdmin);
route.put("/quitar/permiso", estacionService.quitarPermisos);

export default route;
