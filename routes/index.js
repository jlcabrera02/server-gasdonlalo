import Router from "express";
import departamentoRouter from "./departamento.router";
import empleadoRouter from "./empleado.router";
import incumplimientoRouter from "./incumplimiento.router";
import montoFaltanteRouter from "./montoFaltante.router";
import estacionServiceRouter from "./estacionService.router";
import checklistBombaRouter from "./checklistBomba.router";
import bombaRouter from "./bomba.router";
import evaluacionUniformeRouter from "./evaluacionUniforme.router";
import recoleccionEfectivoRouter from "./recoleccionEfectivo.router";
import pasosDespacharRouter from "./pasosDespachar.router";

const route = Router();

route.use("/departamento", departamentoRouter);
route.use("/empleado", empleadoRouter);
route.use("/incumplimiento", incumplimientoRouter);
route.use("/monto-faltante-despachador", montoFaltanteRouter);
route.use("/estaciones-servicio", estacionServiceRouter);
route.use("/bomba-check", checklistBombaRouter);
route.use("/bomba", bombaRouter);
route.use("/pasos-despachar", pasosDespacharRouter);
route.use("/recoleccion-efectivo", recoleccionEfectivoRouter);
route.use("/evaluacion-uniforme", evaluacionUniformeRouter);

export default route;
