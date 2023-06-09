import router from "express-promise-router";
import excel from "../controllers/excel.controller";
import {
  Liquidacion,
  LitrosVendidosXIdempleado,
  preciosCombustible,
} from "../excelReportes/liquidacion.excel";

const route = router();

route.post("/relojChecador", excel.relojChecador);

//Liquidacion
route.get("/liquidacion/:idLiquidacion", Liquidacion);
route.get("/liquidacion/preciosCombustible", preciosCombustible);
route.post("/liquidacion/litrosXidEmpleado", LitrosVendidosXIdempleado);

export default route;
