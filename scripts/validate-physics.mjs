import assert from 'node:assert/strict';

const k = 8.9875517923e9;
const eps0 = 8.8541878128e-12;
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

// Unidad I: Ley de Coulomb. q1=2 nC, q2=-3 nC, r=0.5 m.
const Fc = k * Math.abs(2e-9 * -3e-9) / (0.5 ** 2);
assert(close(Fc, 2.157012430152e-7));

// Unidad I: campo y potencial de una carga de +5 nC a 2 m.
const E = k * 5e-9 / (2 ** 2);
const V = k * 5e-9 / 2;
assert(close(E, 11.234439740375));
assert(close(V, 22.46887948075));

// Superposición: dos cargas iguales y opuestas simétricas tienen V=0 en el origen.
const q = 5e-9, a = 1.6;
const VdipoloOrigen = k * q / a + k * (-q) / a;
assert(close(VdipoloOrigen, 0));

// Unidad II: capacitor de placas paralelas A=0.02 m², d=1 mm, vacío.
const C = eps0 * 0.02 / 0.001;
const Q = C * 12;
const U = 0.5 * C * 12 ** 2;
assert(close(C, 1.77083756256e-10));
assert(close(Q, 2.125005075072e-9));
assert(close(U, 1.2750030450432e-8));

// La capacitancia se duplica si el área se duplica y todo lo demás permanece fijo.
const C2 = eps0 * 0.04 / 0.001;
assert(close(C2, 2 * C));

// Dieléctrico: teflón K=2.1 multiplica la capacitancia por 2.1.
const CTeflon = 2.1 * eps0 * 0.02 / 0.001;
assert(close(CTeflon, 2.1 * C));

// Energía independiente U=1/2 CV²: C=10 nF, V=12 V.
const Umanual = 0.5 * 10e-9 * 12 ** 2;
assert(close(Umanual, 7.2e-7));

// Capacitores equivalentes: 10 nF y 20 nF.
const Cserie = 1 / (1 / 10 + 1 / 20);
const Cparalelo = 10 + 20;
assert(close(Cserie, 6.666666666666667));
assert(close(Cparalelo, 30));

console.log('✓ Unidad I: Ley de Coulomb');
console.log('✓ Unidad I: campo eléctrico');
console.log('✓ Unidad I: potencial eléctrico y superposición');
console.log('✓ Unidad II: capacitancia, carga y energía');
console.log('✓ Unidad II: dieléctricos y relaciones paramétricas');
console.log('✓ Unidad II: calculadora independiente de energía');
console.log('✓ Unidad II: capacitancia equivalente serie/paralelo');
console.log('\nTodas las validaciones físicas de las Unidades I y II pasaron correctamente.');
