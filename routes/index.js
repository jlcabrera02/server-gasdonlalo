import Router from "express";
//Salidas no conformes
import salidaNoConformeRouter from "./s.salidaNoConforme.router";
import incumplimientoRouter from "./s.incumplimiento.router";
//despacho
import listaRecursosDespachadorRouter from "./d.listaRecursosDespachador.router";
import evaluacionUniformeRouter from "./d.evaluacionUniforme.router";
import recoleccionEfectivoRouter from "./d.recoleccionEfectivo.router";
import pasosDespacharRouter from "./d.pasosDespachar.router";
import checklistBombaRouter from "./d.checklistBomba.router";
import montoFaltanteRouter from "./d.montoFaltante.router";
//administrativo
import estacionServiceRouter from "./ad.estacionService.router";
import bombaRouter from "./ad.bomba.router";
//mantenimiento
import ordenTrabajoCalidad from "./m.ordenTrabajoCalidad.router";
// Recursos humanos
import controlDocumentosRouter from "./rh.controlDocumentos.router";
import departamentoRouter from "./rh.departamento.router";
import solicitudEmpleo from "./rh.solicitudEmpleo.route";
import entregaRecurso from "./rh.entregaRecursos.route";
import capturaEntrada from "./rh.capturaEntradas.route";
import empleadoRouter from "./rh.empleado.router";
import madrugador from "./rh.madrugador.route";
import octanoso from "./rh.octanoso.route";
import aceitoso from "./rh.aceitoso.route";
//Autenticacion
import auth from "./auth.router";
const route = Router();

//Salidas no conformes
route.use("/salida-no-conforme", salidaNoConformeRouter);
route.use("/incumplimiento", incumplimientoRouter);
//despacho
route.use("/lista-recurso-despachador", listaRecursosDespachadorRouter);
route.use("/monto-faltante-despachador", montoFaltanteRouter);
route.use("/evaluacion-uniforme", evaluacionUniformeRouter);
route.use("/recoleccion-efectivo", recoleccionEfectivoRouter);
route.use("/pasos-despachar", pasosDespacharRouter);
route.use("/bomba-check", checklistBombaRouter);
//administrativo
route.use("/estaciones-servicio", estacionServiceRouter);
route.use("/bomba", bombaRouter);
//mantinimiento
route.use("/orden-trabajo-calidad", ordenTrabajoCalidad);
/*Recursos humanos*/
route.use("/control-documento", controlDocumentosRouter);
route.use("/departamento", departamentoRouter);
route.use("/entrega-recursos", entregaRecurso);
route.use("/empleado", empleadoRouter);
route.use("/solicitudes", solicitudEmpleo);
route.use("/madrugador", madrugador);
route.use("/entrada", capturaEntrada);
route.use("/octanoso", octanoso);
route.use("/aceitoso", aceitoso);
//Autenticacion
route.use("/auth", auth);

export default route;
