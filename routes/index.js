import Router from "express";
//Salidas no conformes
import salidaNoConformeRouter from "./s.salidaNoConforme.router";
import incumplimientoRouter from "./s.incumplimiento.router";
import acumular from "./s.acumular.router";
import snc from "./snc/index";
//despacho
import listaRecursosDespachadorRouter from "./d.listaRecursosDespachador.router";
import recursosDespachadorRouter from "./d.recursosDespachador.router";
import evaluacionUniformeRouter from "./d.evaluacionUniforme.router";
import pasosDespacharRouter from "./d.pasosDespachar.router";
import checklistBombaRouter from "./d.checklistBomba.router";
import montoFaltanteRouter from "./d.montoFaltante.router";
import oylRouter from "./d.oylIsla.router";
import configDespacho from "./d.configDespacho";
//administrativo
import estacionServiceRouter from "./ad.estacionService.router";
import bombaRouter from "./ad.bomba.router";
import administrativo from "./administrativo";
//mantenimiento
import ordenTrabajoCalidad from "./m.ordenTrabajoCalidad.router";
import mantenimiento from "./mantenimiento.router";
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
import rhr from "./recursosHumanos";
//Autenticacion
import auth from "./auth.router";
//Excel
import excel from "./excel.route";
//PDF
import pdf from "./pdf.router";
const route = Router();

//Complementos adicionales
import com from "./complementos.router";

//Vistas
import indexV from "./view.index.router";

//Liquidacion
import islas from "./l.islas.router";
import dir from "./documentos.router";

//Pagara
import pagare from "./p.pagares.router";

//Configuraciones
import config from "./configuraciones.routes";

//Pronosticos
import pronosticos from "./pronosticos/pronosticos.routes";

//Salidas no conformes
route.use("/salida-no-conforme", salidaNoConformeRouter);
route.use("/incumplimiento", incumplimientoRouter);
route.use("/sncacumuladas", acumular);
route.use("/snc", snc);
//

route.use("/despacho", configDespacho);
route.use("/recursos-despachador", recursosDespachadorRouter);
route.use("/lista-recurso-despachador", listaRecursosDespachadorRouter);
route.use("/monto-faltante-despachador", montoFaltanteRouter);
route.use("/evaluacion-uniforme", evaluacionUniformeRouter);
route.use("/pasos-despachar", pasosDespacharRouter);
route.use("/bomba-check", checklistBombaRouter);
route.use("/ordenLimpieza", oylRouter);
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
route.use("/recursoshumanos", rhr);
//Autenticacion
route.use("/auth", auth);
//Complementos
route.use("/com", com);
//exceles
route.use("/excel", excel);
//pdf
route.use("/pdf", pdf);
// Vistas
route.use("/view", indexV);
//Lisquidacion
route.use("/liquidacion", islas);
route.use("/administrativo", administrativo);
route.use("/documentos", dir);
route.use("/pagare", pagare);
route.use("/mantenimiento", mantenimiento);
//configuraciones
route.use("/config", config);

//Pronosticos
route.use("/pronosticos", pronosticos);

export default route;
