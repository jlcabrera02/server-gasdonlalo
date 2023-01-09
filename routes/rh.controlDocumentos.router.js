import router from "express-promise-router";
import cd from "../controllers/rh.controlDocumentos.controller";

const route = router();

route.get("/", cd.findTotalDocumentos);
route.get("/:idEmpleado", cd.findDocumentosXIdempleado);
route.post("/", cd.insert);
route.put("/", cd.update);

export default route;
