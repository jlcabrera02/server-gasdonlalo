import http from "http";
import { v4 as uuidv4 } from "uuid";
import { WebSocketServer } from "ws";
import { btnPanicOn, btnPanicOff, getPanicInfo } from "./panicbtn.socket";

export const clients = {};
const server = http.createServer();
export const eventTypes = {
  CLOSE_LIQUIDACION: "closeLiquidacion",
  PANIC_BTN_ON: "panicBtnOn",
  PANIC_BTN_OFF: "panicBtnOff",
  GET_PANIC_INFO: "getPanicInfo",
  AVISO: "aviso",
  DISCONNECT: "disconnect",
};
export const users = {};

const wSocket = new WebSocketServer({ server }); //Socket

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

async function processReceivedMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type, data: dataFromClient };

  switch (dataFromClient.type) {
    case eventTypes.CLOSE_LIQUIDACION:
      // json.usuarios = { users };
      sendMessageToAllClients(json, userId);
      break;
    case eventTypes.PANIC_BTN_ON:
      await btnPanicOn(json, userId);
      break;
    case eventTypes.PANIC_BTN_OFF:
      btnPanicOff(json, userId);
      break;
    case eventTypes.GET_PANIC_INFO:
      getPanicInfo(json, userId);
      break;
  }
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

export default server;
