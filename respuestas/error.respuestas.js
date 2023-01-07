const respuesta = {};
//Error

respuesta.peticionImposible = (msg, response) => {
  return {
    success: false,
    code: 400,
    msg: msg || "Es imposible hacer esta petición",
    response,
  };
};

respuesta.errorMath = (msg, response) => {
  return {
    success: false,
    code: 400,
    msg: msg || "El elemento no pertenece a la categoría",
    response,
  };
};

respuesta.datosExistentes = (msg = null, responseSQl) => {
  return {
    success: false,
    code: 400,
    msg: msg || "Los datos ingresados ya existen",
    responseSQl,
  };
};

respuesta.errorDB = (response) => {
  return {
    success: false,
    code: 400,
    msg: "Error en la conexión no has enviados los datos completos",
    response,
  };
};

respuesta.sinRegistro = (response = []) => {
  return {
    success: false,
    code: 400,
    msg: "No hay registros",
    response,
  };
};

respuesta.sinCambios = (response) => {
  return {
    success: false,
    code: 400,
    msg: "No se detecto ningún cambio",
    response,
  };
};

respuesta.sinEliminar = (response) => {
  return {
    success: false,
    code: 400,
    msg: "No se elimino ningún registro",
    response,
  };
};

export default respuesta;
