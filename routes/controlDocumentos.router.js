import router from "express-promise-router";
import controlDoc from "../controllers/controlDocumentos.controller";

const route = router();

route.get("/", controlDoc.findTotalDocumentos);
route.get("/:idEmpleado", controlDoc.findDocumentosXIdempleado);
route.post("/", controlDoc.insert);
route.put("/", controlDoc.update);
// route.delete("/:id", control.delete);

export default route;
