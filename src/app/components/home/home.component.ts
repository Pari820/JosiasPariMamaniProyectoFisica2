import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero page">
      <div class="intro">
        <div class="kicker">PROYECTO PERSONAL · FÍSICA II</div><div class="student">Estudiante: <b>Josias Pari Mamani</b></div>
        <h1>Simulador interactivo de campos eléctricos y capacitores</h1>
        <p class="lead">Aplicación educativa para visualizar y comprobar los conceptos desarrollados en las Unidades I y II mediante cálculos, gráficas y simulaciones 2D/3D.</p>
        <div class="actions">
          <a class="btn primary" routerLink="/unidad-1-campo-electrico">Ir a Unidad I</a>
          <a class="btn secondary" routerLink="/unidad-2-capacitores">Ir a Unidad II</a>
        </div>
      </div>
      <aside class="summary panel">
        <h2>Contenido de la entrega</h2>
        <table>
          <tr><th>Unidad I</th><td>Cargas puntuales, Ley de Coulomb, campo eléctrico, superposición, potencial y trayectoria.</td></tr>
          <tr><th>Unidad I · Vista 3D</th><td>Representación tridimensional de cargas, vectores y superficie de potencial.</td></tr>
          <tr><th>Unidad II</th><td>Capacitancia, placas paralelas, dieléctricos, carga y energía almacenada.</td></tr>
        </table>
      </aside>
    </section>

    <section class="page modules">
      <div class="section-title"><span>MÓDULOS DEL PROYECTO</span><h2>Organización por unidad</h2><p>Cada módulo permite demostrar un criterio del producto solicitado y relacionarlo con las fórmulas trabajadas en clase.</p></div>
      <div class="unit-grid">
        <article class="unit-card panel">
          <div class="number">I</div>
          <div class="content"><h3>Electricidad, campo eléctrico y potencial</h3><ul><li>Ley de Coulomb entre dos cargas.</li><li>Hasta 10 cargas puntuales en el plano.</li><li>Vectores y líneas de campo.</li><li>Líneas equipotenciales y potencial en un punto.</li><li>Partícula de prueba y trayectoria.</li></ul><div class="links"><a class="btn primary" routerLink="/unidad-1-campo-electrico">Abrir simulador 2D</a><a class="btn secondary" routerLink="/unidad-1-3d">Abrir vista 3D</a></div></div>
        </article>
        <article class="unit-card panel">
          <div class="number">II</div>
          <div class="content"><h3>Capacitores y dieléctricos</h3><ul><li>Definición de capacitancia C = Q/V.</li><li>Capacitor de placas paralelas.</li><li>Variación de área, separación y dieléctrico.</li><li>Carga y energía almacenada.</li><li>Gráficas paramétricas y complemento serie/paralelo.</li></ul><div class="links"><a class="btn primary" routerLink="/unidad-2-capacitores">Abrir Unidad II</a></div></div>
        </article>
      </div>
      <div class="academic-note note"><b>Enfoque:</b> el software prioriza la explicación física. Las visualizaciones cambian al modificar los parámetros para que las relaciones matemáticas puedan observarse directamente.</div>
    </section>
  `,
  styles: [`
    .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:center;padding:58px 0 42px}.kicker,.section-title span{font-size:11px;letter-spacing:.13em;color:var(--blue);font-weight:700}.intro h1{font-size:clamp(38px,5vw,60px);line-height:1.08;color:var(--navy);font-weight:650;margin:12px 0 18px;max-width:800px}.student{margin-top:8px;color:#52677e;font-size:14px}.lead{font-size:18px;color:#52677e;max-width:760px;line-height:1.65}.actions{display:flex;gap:9px;margin-top:24px}.summary{padding:22px}.summary h2{font-size:19px;color:var(--navy);margin:0 0 15px}.summary table{width:100%;border-collapse:collapse;font-size:12px}.summary th,.summary td{padding:12px 8px;border-top:1px solid #e2e8f0;text-align:left;vertical-align:top}.summary th{width:100px;color:var(--navy)}.summary td{color:#5a6f84}.modules{padding:18px 0 80px}.section-title{max-width:760px;margin-bottom:20px}.section-title h2{font-size:31px;color:var(--navy);margin:5px 0}.section-title p{color:var(--muted);margin:0}.unit-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.unit-card{display:grid;grid-template-columns:74px 1fr;padding:24px}.number{width:56px;height:56px;display:grid;place-items:center;background:#eaf2f9;border:1px solid #bfd1e2;border-radius:6px;color:var(--navy);font-family:Georgia,serif;font-size:27px;font-weight:700}.content h3{margin:0 0 12px;color:var(--navy);font-size:22px}.content ul{margin:0;padding-left:19px;color:#5a6f84;font-size:13px;line-height:1.75}.links{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.note{margin-top:16px}@media(max-width:900px){.hero,.unit-grid{grid-template-columns:1fr}.summary{order:2}}@media(max-width:560px){.unit-card{grid-template-columns:1fr}.number{margin-bottom:14px}.actions{flex-direction:column}}
  `]
})
export class HomeComponent {}
