import app from "./app";
import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();

const wSocket = new WebSocketServer({ server }); //Socket
const clients = {};
const users = {};
const eventTypes = {
  CLOSE_LIQUIDACION: "closeLiquidacion",
  PANIC_BTN: "panicBtn",
  DISCONNECT: "disconnect",
};

const sendMessageToAllClients = (data, userIdTransmitting) => {
  for (const userId in clients) {
    const client = clients[userId];
    if (client.readyState === 1 && userId !== userIdTransmitting) {
      const dataSend = { ...data };
      delete dataSend.usuarios;
      client.send(JSON.stringify(dataSend));
    }
  }
};

function processReceivedMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };

  if (
    dataFromClient.type === eventTypes.CLOSE_LIQUIDACION ||
    dataFromClient.type === eventTypes.PANIC_BTN
  ) {
    users[userId] = dataFromClient;
    json.usuarios = { users };
    json.data = dataFromClient;
  }

  sendMessageToAllClients(json, userId);
}

function handleClientDisconnection(userId) {
  console.log(`${userId} disconnected.`);
  const json = { type: eventTypes.DISCONNECT };
  json.data = { users };
  delete clients[userId];
  delete users[userId];
  sendMessageToAllClients(json);
}

wSocket.on("connection", function (connection) {
  const userId = uuidv4();
  console.log("Received a new connection");

  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on("message", (message) => {
    processReceivedMessage(message, userId);
  });
  connection.on("close", () => handleClientDisconnection(userId));
});

//Inicializo el servidores

server.listen(app.get("port-socket"), () => {
  console.log(
    "Servidor socket escuchando en el puerto " + app.get("port-socket")
  );
});

app.listen(app.get("port"), () => {
  console.log(`Servidor HTTP escuchando en el puerto ${app.get("port")}`);
});
