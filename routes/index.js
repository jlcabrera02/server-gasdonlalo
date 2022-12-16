import Router from "express";
import departamentoRouter from "./departamento.router";
import empleadoRouter from "./empleado.router";
import incumplimientoRouter from "./incumplimiento.router";
import montoFaltanteRouter from "./montoFaltante.router";
import estacionServiceRouter from "./estacionService.router";

const route = Router();

route.use("/departamento", departamentoRouter);
route.use("/empleado", empleadoRouter);
route.use("/incumplimiento", incumplimientoRouter);
route.use("/monto-faltante-despachador", montoFaltanteRouter);
route.use("/estaciones-servicio", estacionServiceRouter);

export default route;
