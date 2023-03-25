import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";

const route = router();

route.get("/islas/:idEstacion", islas.findIslas);
route.post("/islas/insertar", islas.insertIslas);

export default route;
