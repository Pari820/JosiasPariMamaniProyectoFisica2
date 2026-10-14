# Simulador de Física II — Entrega personal Unidades I y II
**Estudiante:** Josias Pari Mamani  

Aplicación web académica desarrollada en Angular + TypeScript para la entrega personal de las dos primeras unidades de Física II.

## Enfoque de esta versión
- Diseño visual sobrio: blanco, azul y gris.
- Prioridad en la explicación física y no en la programación.
- Fórmulas y ayudas integradas para facilitar la exposición.
- Contenidos reforzados con los temas trabajados en clase: Ley de Coulomb, campo eléctrico, superposición, carga de prueba, capacitancia, dieléctricos y energía.

## Unidad I — Electricidad, Campo Eléctrico y Potencial
- Calculadora de Ley de Coulomb entre dos cargas puntuales.
- Visualizador de hasta 10 cargas puntuales con arrastre directo mediante mouse.
- Campo eléctrico vectorial en 2D.
- Líneas de campo eléctrico.
- Mapa de potencial y líneas equipotenciales.
- Calculadora de campo y potencial en cualquier punto (x,y).
- Simulador numérico de trayectoria de una partícula de prueba.
- Vista 3D con Three.js/WebGL: cargas arrastrables, vectores y superficie tridimensional del potencial.

## Unidad II — Capacitores y Dieléctricos
- Definición fundamental `C = Q/V`.
- Simulador de capacitor de placas paralelas.
- Variación interactiva de área, separación, voltaje y constante dieléctrica.
- Materiales con constantes dieléctricas tomadas del material trabajado en clase.
- Cálculo de capacitancia C, carga Q, energía U y campo aproximado E.
- Gráficas `C vs distancia`, `C vs área` y `U vs voltaje`.
- Calculadora independiente de energía almacenada.
- Complemento de capacitancia equivalente para dos capacitores en serie o paralelo.

## Base teórica utilizada
La organización física de esta versión se alineó con los materiales de clase de las Unidades I y II: fuerza electrostática/Ley de Coulomb y capacitancia/dieléctricos (Young y Freedman, Física Universitaria, capítulos 21 y 24).

## Requisitos
- Node.js 20 o superior.
- npm.
- Navegador moderno con WebGL para la vista 3D.

## Ejecutar
```bash
npm install
npm run test:physics
npm start
```
Luego abrir `http://localhost:4200` si el navegador no se abre automáticamente.

## Validar cálculos
```bash
npm run test:physics
```

Las pruebas incluyen Ley de Coulomb, campo, potencial, superposición, capacitancia, dieléctricos, energía y capacitancia equivalente.

## Compilar
```bash
npm run build
```

## Publicar en GitHub Pages
El proyecto incluye `.github/workflows/deploy.yml` para preparar el despliegue del sitio cuando el repositorio esté en GitHub.

## Estructura
- `src/app/components/electric-field`: Unidad I 2D, Coulomb, potencial y trayectoria.
- `src/app/components/lab3d`: visualización 3D de Unidad I.
- `src/app/components/capacitors`: Unidad II, energía y capacitancia equivalente.
- `src/app/services/physics.service.ts`: cálculos físicos reutilizables.
- `scripts/validate-physics.mjs`: pruebas numéricas.
- `docs/`: manual, informe, checklist y guía de defensa.

## Datos del estudiante
Completar antes de entregar:
- Nombre: Josias Pari Mamani
- Código: _______________________________
- Curso: Física II
- Carrera: Ingeniería de Sistemas
- Docente: ______________________________
