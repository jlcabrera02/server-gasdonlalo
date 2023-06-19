import router from "express-promise-router";
import { pdfArchivo } from "../services/EmailSendArchivo";

const route = router();

route.post("/sendFile", pdfArchivo);

export default route;
