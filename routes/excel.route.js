import router from "express-promise-router";
import excel from "../controllers/excel.controller";
import {
  Liquidacion,
  LitrosVendidosXIdempleado,
  preciosCombustible,
} from "../excelReportes/liquidacion.excel";

const route = router();

route.post("/relojChecador", excel.relojChecador);

route.get("/liquidacion/preciosCombustible", preciosCombustible);
//Liquidacion
route.get("/liquidacion/:idLiquidacion", Liquidacion);
route.post("/liquidacion/litrosXidEmpleado", LitrosVendidosXIdempleado);

export default route;
