import router from "express-promise-router";
import panicBtn from "../../controllers/administrativo/panicBtn.controller";
const route = router();

route.get("/", panicBtn.buscarDetalles);
route.put("/:idPanic", panicBtn.addDescripcion);

export default route;
