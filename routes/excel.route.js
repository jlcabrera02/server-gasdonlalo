import router from "express-promise-router";
import excel from "../controllers/excel.controller";
import { preciosCombustible } from "../excelReportes/liquidacion.excel";

const route = router();

route.post("/relojChecador", excel.relojChecador);

//Liquidacion
route.get("/liquidacion/preciosCombustible", preciosCombustible);

export default route;
