import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import morgan from "morgan";
import indexV from "./routes/view.index.router";

dotenv.config(); //Inicializo lectura de variables de entorno

//Guardamos en la variable app la instacia de express
const app = express();
//Estableciendo puerto del servidor globalmente
app.set("port", process.env.PORT || 4000);
app.set("port-socket", process.env.PORT_SOCKET || 4001);
//Estableciendo llave de token jwt
app.set("secret_key_jwt", process.env.SECRET_KEY_JWT);
//Establesco las vistas que mostrara el servidor
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Establecer recursos estaticos
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", indexV);
app.use(express.raw());
// app.use(express.bodyParser({ limit: "50mb" }));

//Uso de bodyParse.json y bodyParse.urlencode para poder recibir desde el navegador datos json y poder utilizar el req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload()); //Para subir archivos

app.use("/api", routes);

export default app;
