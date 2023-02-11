import router from "express-promise-router";
import se from "../controllers/rh.solicitudEmpleo.controller";

const route = router();

route.get("/", se.find);
route.get("/estatus/:estatus", se.findXEstatus);
route.post("/nuevo", se.insert);
route.put("/actualizar/motivo/:idEmpleado", se.updateMotivo); //actualiza el motivo
route.put("/control/:idEmpleado", se.update); //idSolicitud = idempleado
route.put("/cambiarDepartamento", se.changeDep); //actualiza el motivo

export default route;
