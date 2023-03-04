function diff(a, b) {
  let an = new Date(a).getTime();
  let ne = new Date(b).getTime();

  let diff = ne - an;
  let dias = diff / (60 * 60 * 24 * 1000);
  let quincenas = dias / 15;
  console.log(quincenas);
}
