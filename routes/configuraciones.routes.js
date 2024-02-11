import router from "express-promise-router";
import config from "../controllers/config.controller";

const route = router();

route.get("/rh/configuraciones", config.obtenerConfigRH);

route.post(
  "/rh/aceitoso/porcentaje/configurar",
  config.configurarPorcentajesAceitoso
);

route.post(
  "/rh/octanoso/efectivo/configurar",
  config.configurarEfectivoOctanoso
);

// route.post("/rh/octanoso/porcentaje/configurar", complement.findOneById);
export default route;
