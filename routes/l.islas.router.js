import router from "express-promise-router";
import islas from "../controllers/l.islas.controller";

const route = router();

route.get("/islas/:idEstacion", islas.findIslas);
route.post("/islas/insertar", islas.insertIslas);
route.put("/islas/casillagas", islas.updateIsla);
route.put("/islas/editarnumero", islas.updateNumeroIsla);

export default route;
