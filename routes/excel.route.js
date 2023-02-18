import router from "express-promise-router";
import excel from "../controllers/excel.controller";

const route = router();

route.get("/evuniforme/:year/:month", excel.createEvUniforme);
route.get("/evPasoDespachador/:year/:month", excel.pasosDespachar);

export default route;
