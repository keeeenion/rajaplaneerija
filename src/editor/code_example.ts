export const  example_code = `
var teekond, uuritav_ristmik, naabrid;

function listsRepeat(value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}

function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}

//
//       Teekonna leidmise funktsiooni block
//
function leia_teekond() {
  uuritav_ristmik = simulation.startIntersection();
  teekond = listsRepeat(null, 0);
  while (!(uuritav_ristmik == simulation.targetIntersection())) {
    console.log(uuritav_ristmik)
    naabrid = simulation.neighbours(uuritav_ristmik);
    if (naabrid.indexOf(simulation.targetIntersection()) + 1 != 0) {
      uuritav_ristmik = simulation.targetIntersection();
    } else {
      uuritav_ristmik = naabrid[(mathRandomInt(1, naabrid.length) - 1)];
    }
  }
  teekond.push(uuritav_ristmik);
  return teekond;
}
`