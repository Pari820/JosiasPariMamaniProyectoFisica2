import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar">
        <a class="brand" routerLink="/">
          <span class="logo">F₂</span>
          <span><b>Simulador de Física II</b><small>Josias Pari Mamani · Unidades I y II</small></span>
        </a>
        <nav>
          <a routerLink="/unidad-1-campo-electrico" routerLinkActive="active">Unidad I · Campo eléctrico</a>
          <a routerLink="/unidad-1-3d" routerLinkActive="active">Unidad I · Vista 3D</a>
          <a routerLink="/unidad-2-capacitores" routerLinkActive="active">Unidad II · Capacitores</a>
        </nav>
      </header>
      <main><router-outlet /></main>
      <footer>
        Josias Pari Mamani · Física II · Ingeniería de Sistemas · Unidades I y II
      </footer>
    </div>
  `,
  styles: [`
    .shell{min-height:100vh;display:flex;flex-direction:column}.topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px clamp(16px,4vw,60px);background:#fff;border-bottom:1px solid #cfd9e4;box-shadow:0 1px 4px rgba(15,23,42,.06)}.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--navy)}.logo{display:grid;place-items:center;width:42px;height:42px;border-radius:6px;background:var(--navy);color:#fff;font-family:Georgia,serif;font-size:19px;font-weight:700}.brand>span:last-child{display:flex;flex-direction:column}.brand b{font-size:16px}.brand small{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.topbar nav{display:flex;gap:3px;flex-wrap:wrap;justify-content:flex-end}.topbar nav a{padding:9px 10px;border-radius:5px;color:#566b80;text-decoration:none;font-size:14px;border-bottom:2px solid transparent}.topbar nav a:hover{background:#f2f6fa}.topbar nav a.active{color:var(--navy);border-bottom-color:var(--blue);background:#f4f8fb}main{flex:1}footer{padding:22px;text-align:center;border-top:1px solid #d7e0e9;font-size:13px;color:var(--muted);background:#fff}@media(max-width:900px){.topbar{align-items:flex-start;flex-direction:column}.topbar nav{justify-content:flex-start}}
  `]
})
export class AppComponent {}
