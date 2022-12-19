import router from "express-promise-router";
import pasosDespachar from "../controllers/pasosDespachar.controller";

const route = router();

// route.get("/general/:year/:month", pasosDespachar.findAllXMonth);
// route.get("/:id", pasosDespachar.findOne);
route.post("/", pasosDespachar.insert);
// route.put("/:id", pasosDespachar.update);
// route.delete("/:id", pasosDespachar.delete);

export default route;
