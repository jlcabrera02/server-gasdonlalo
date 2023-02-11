export default function mayusxPalabra(string) {
  let primeraLetra = string.charAt(0).toLocaleUpperCase();
  let textoEntero = string
    .replace(/\s\w|[á,é,ó,í,ú,ñ]/g, (math) => math.toLocaleUpperCase())
    .slice(1);
  return primeraLetra + textoEntero;
}

export function mayus(string) {
  return string.toLocaleUpperCase();
}

//Esta función me da un formato especifico de con que sintaxis se guardaran los datos en la base de datos del usuario. IMPORTANTE
