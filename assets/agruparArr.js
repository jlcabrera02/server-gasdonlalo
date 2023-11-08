//El parametro equal si si viene en verdadero trasformara la propiedad en minusculas para evitar duplicados como hola || HolA || hOLa = hola
const agruparArr = (arr, callback, options) => {
  const { groupd, forceEqual } = options || {};
  const group = groupd ? { ...groupd } : {};
  arr.forEach((el) => {
    const property = forceEqual
      ? String(callback(el)).toLowerCase()
      : callback(el);
    if (group.hasOwnProperty(property)) {
      group[property].push(el);
    } else {
      group[property] = [el];
    }
  });

  return {
    keys: () => Object.keys(group),
    values: () => Object.values(group),
    single: () => group,
  };
};
export default agruparArr;
