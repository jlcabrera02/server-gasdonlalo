import { clients, eventTypes } from ".";
import model from "../models/index";
const { PanicBtn, Islas } = model;

//Esta funcion manda una alerta de panico a los demas clientes y crea un registro.
export const btnPanicOn = async (data, userIdTransmitting) => {
  try {
    const save = await PanicBtn.create({
      idempleado: null,
      idisla: data.data.idIsla,
    });

    for (const userId in clients) {
      const client = clients[userId];
      if (client.readyState === 1 && userId !== userIdTransmitting) {
        const dataSend = { ...data, escena: "" };
        delete dataSend.usuarios;
        client.send(JSON.stringify(dataSend));
      }
    }

    clients[userIdTransmitting].send(
      JSON.stringify({
        ...data,
        success: true,
        escena: "verificarPeticionCumplida",
        response: JSON.parse(JSON.stringify(save)),
        type: eventTypes.PANIC_BTN_OFF,
      })
    );
  } catch (err) {
    clients[userIdTransmitting].send(
      JSON.stringify({
        ...data,
        success: false,
        escena: "verificarPeticionCumplida",
        response: err,
        type: eventTypes.PANIC_BTN_OFF,
      })
    );
  }
};

//Esta funcion manda una alerta para apagar las alarmas
export const btnPanicOff = async (data, userIdTransmitting) => {
  try {
    const offAlarm = await PanicBtn.update(
      { activo: false, idempleado: null },
      { where: { activo: true, idisla: data.data.idIsla } }
    );

    for (const userId in clients) {
      const client = clients[userId];
      if (client.readyState === 1 && userId !== userIdTransmitting) {
        const dataSend = { ...data, escena: "" };
        delete dataSend.usuarios;
        client.send(JSON.stringify(dataSend));
      }
    }

    clients[userIdTransmitting].send(
      JSON.stringify({
        ...data,
        success: true,
        response: offAlarm,
        escena: "verificarPeticionCumplida",
        type: eventTypes.PANIC_BTN_ON,
      })
    );
  } catch (err) {
    clients[userIdTransmitting].send(
      JSON.stringify({
        ...data,
        success: false,
        response: err,
        escena: "verificarPeticionCumplida",
        type: eventTypes.PANIC_BTN_ON,
      })
    );
  }
};

//Obtener el estado de las islas con disfuncionalidades.
export const getPanicInfo = async (data, userIdTransmitting) => {
  try {
    const consultaIslas = await PanicBtn.findAll({
      where: { activo: true },
      include: [{ model: Islas }],
    });

    clients[userIdTransmitting].send(
      JSON.stringify({
        ...data,
        escena: "obteniendoDatosEstadoIslas",
        success: true,
        response: JSON.parse(JSON.stringify(consultaIslas)),
        type: eventTypes.GET_PANIC_INFO,
      })
    );
  } catch (err) {
    if (clients[userIdTransmitting]) {
      clients[userIdTransmitting.readyState === 1].send(
        JSON.stringify({
          ...data,
          escena: "obteniendoDatosEstadoIslas",
          success: false,
          response: err,
          type: eventTypes.GET_PANIC_INFO,
        })
      );
    }
  }
};

//Socket que mando al cliente para actualizar la peticion de checklist de bomba.
export const mandarActualizacion = async () => {
  try {
    for (const userId in clients) {
      const client = clients[userId];
      if (client.readyState === 1) {
        const dataSend = {
          escena: "actualizarPeticion",
          type: eventTypes.AVISO,
        };
        delete dataSend.usuarios;
        client.send(JSON.stringify(dataSend));
      }
    }
  } catch (err) {
    clients[userIdTransmitting].send(
      JSON.stringify({
        escena: "actualizarPeticion",
        success: false,
        response: err,
        type: eventTypes.GET_PANIC_INFO,
      })
    );
  }
};
