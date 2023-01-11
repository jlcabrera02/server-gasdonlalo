import router from "express-promise-router";
import bomba from "../controllers/ad.bomba.controller";

const route = router();

route.get("/", bomba.find);
route.get("/:id", bomba.findOne);
route.post("/", bomba.insert);
route.put("/:id", bomba.update);
route.delete("/:id", bomba.delete);

export default route;
