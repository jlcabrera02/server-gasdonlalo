import Router from "express";
import departamentoRouter from "./departamento.router";
import empleadoRouter from "./empleado.router";
import incumplimientoRouter from "./incumplimiento.router";
import montoFaltanteRouter from "./montoFaltante.router";
import estacionServiceRouter from "./estacionService.router";
import checklistBombaRouter from "./checklistBomba.router";
import bombaRouter from "./bomba.router";
import evaluacionUniformeRouter from "./evaluacionUniforme.router";
import listaRecursosDespachadorRouter from "./listaRecursosDespachador.router";
import recoleccionEfectivoRouter from "./recoleccionEfectivo.router";
import pasosDespacharRouter from "./pasosDespachar.router";
import salidaNoConformeRouter from "./salidaNoConforme.router";
import ordenTrabajoCalidad from "./ordenTrabajoCalidad.router";
// Recursos humanos importaciones
import controlDocumentosRouter from "./rh.controlDocumentos.router";
import solicitudEmpleo from "./rh.solicitudEmpleo.route";
import capturaEntrada from "./rh.capturaEntradas.route";
import madrugador from "./rh.madrugador.route";

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
route.use("/lista-recurso-despachador", listaRecursosDespachadorRouter);
route.use("/salida-no-conforme", salidaNoConformeRouter);
route.use("/orden-trabajo-calidad", ordenTrabajoCalidad);
/*Recursos humanos*/
route.use("/control-documento", controlDocumentosRouter);
route.use("/solicitudes", solicitudEmpleo);
route.use("/entrada", capturaEntrada);
route.use("/madrugador", madrugador);

export default route;
