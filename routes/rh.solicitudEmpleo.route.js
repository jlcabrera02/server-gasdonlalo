import router from "express-promise-router";
import se from "../controllers/rh.solicitudEmpleo.controller";

const route = router();

// route.get("/", bomba.find);
route.get("/estatus/:estatus", se.findXEstatus);
route.post("/nuevo", se.insert);
route.put("/control/:idSolicitud", se.update);
// route.delete("/:id", bomba.delete);

export default route;
