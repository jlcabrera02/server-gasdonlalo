import router from "express-promise-router";
import auth from "../controllers/auth.controller";

const route = router();

route.get("/", auth.validarTiempoSesion); //Me valida el tiempo en sesion
route.get("/usuarios/:idChecador", auth.findByIdEmpleado);
route.get("/usuarios", auth.findAll);
route.get("/permisos/:idChecador", auth.findPermisosXEmpleado);
route.get("/permisos", auth.findPermisos);
route.get("/listAccessKey", auth.ListLlaveAcceso);
route.get("/auditorias", auth.infoAuditorias);
route.post("/accessKey", auth.AccessLlaveAcceso);
route.delete("/deleteAccessKey/:key", auth.RemoveLlaveAcceso);
route.post("/createAccessKey", auth.CreateLlaveAcceso);
route.post("/login", auth.login);
route.post("/registrar/permiso", auth.registerPermisos);
route.post("/registrar", auth.register);
route.put("/changePass", auth.changePass);
route.put("/changePassA", auth.changePassAdmin);
route.put("/quitar/permiso", auth.quitarPermisos);

export default route;
