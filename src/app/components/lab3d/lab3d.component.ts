import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface Charge3D { id: number; x: number; y: number; z: number; q: number; }

@Component({
  selector: 'app-lab3d',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <div class="lab-head">
        <div><div class="unit">UNIDAD I · VISUALIZACIÓN 3D</div><h1>Campo y potencial eléctrico en 3D</h1><p>Explora cargas puntuales con cámara interactiva. Las flechas representan la dirección local de E⃗ y la superficie representa el potencial V(x,y).</p></div>
        <div class="formula">E⃗ = Σ kq r⃗/r³ · V = Σ kq/r</div>
      </div>

      <div class="notice"><b>Interacción:</b> arrastra una carga para cambiar su posición. Arrastrar el fondo gira la cámara y la rueda del mouse controla el acercamiento.</div>

      <div class="layout">
        <aside class="panel side">
          <div class="section-label">Distribución de cargas</div>
          <div class="tabbar"><button [class.active]="preset==='dipolo'" (click)="loadDipole()">Dipolo</button><button [class.active]="preset==='triangulo'" (click)="loadTriangle()">Triángulo</button></div>

          <div class="section-label gap">Capas 3D</div>
          <label class="check"><input type="checkbox" [(ngModel)]="showVectors" (change)="rebuildField()"> Vectores de campo E⃗</label>
          <label class="check"><input type="checkbox" [(ngModel)]="showSurface" (change)="rebuildPotentialSurface()"> Superficie del potencial V</label>
          <label class="check"><input type="checkbox" [(ngModel)]="showXZ" (change)="rebuildField()"> Vectores adicionales en plano XZ</label>

          <label><span class="control-label"><span>Densidad de vectores</span><b>{{density}}×{{density}}</b></span><input type="range" [(ngModel)]="density" min="5" max="11" step="2" (change)="rebuildField()"></label>
          <label><span class="control-label"><span>Escala de flechas</span><b>{{arrowScale.toFixed(1)}}</b></span><input type="range" [(ngModel)]="arrowScale" min="0.5" max="2" step="0.1" (input)="rebuildField()"></label>
          <label><span class="control-label"><span>Altura de potencial</span><b>{{surfaceScale.toFixed(1)}}</b></span><input type="range" [(ngModel)]="surfaceScale" min="0.5" max="2.2" step="0.1" (input)="rebuildPotentialSurface()"></label>

          <div class="section-label gap">Cámara</div>
          <div class="camera"><button class="btn secondary" (click)="viewIso()">Isométrica</button><button class="btn secondary" (click)="viewTop()">Superior</button><button class="btn secondary" (click)="viewFront()">Frontal</button></div>

          <div class="section-label gap">Cargas</div>
          <div class="charge-row" *ngFor="let c of charges" [class.active]="draggingId===c.id"><i [class.pos]="c.q>0" [class.neg]="c.q<0">{{c.q>0?'+':'−'}}</i><span>q={{c.q}} nC<br><small>({{c.x.toFixed(2)}}, {{c.y.toFixed(2)}}, {{c.z.toFixed(2)}}) m</small></span></div>
          <p class="help">La vista 3D representa las mismas ecuaciones de campo y potencial en una visualización espacial para facilitar su interpretación.</p>
        </aside>

        <div class="panel stage-card">
          <div class="toolbar"><span>Visualización tridimensional · Unidad I</span><b>Vista interactiva</b></div>
          <div #stage class="stage"></div>
          <div class="drag-status" *ngIf="draggingCharge as c">Moviendo carga {{c.q}} nC → x={{c.x.toFixed(2)}} m, y={{c.y.toFixed(2)}} m</div>
          <div class="legend"><span><i class="red"></i> carga / potencial +</span><span><i class="blue"></i> carga / potencial −</span><span><i class="cyan"></i> vector E⃗</span><span><i class="surface"></i> superficie V(x,y)</span></div>
        </div>
      </div>

      <div class="learn-grid">
        <article class="panel learn-card"><div class="section-label">¿Qué muestra?</div><h3>Vectores del campo E⃗</h3><p>Cada flecha indica la dirección del campo eléctrico en ese punto. Su orientación cambia cuando mueves las cargas.</p><p class="say">La vista 3D permite observar la orientación espacial del campo; el cálculo físico sigue basándose en la Ley de Coulomb y el principio de superposición.</p></article>
        <article class="panel learn-card"><div class="section-label">¿Qué muestra?</div><h3>Superficie de potencial V</h3><p>La altura y el color representan el potencial. Las regiones positivas tienden al rojo y las negativas al azul.</p><p class="say">El potencial es una magnitud escalar; la superficie permite representar visualmente cuánto vale V en cada posición.</p></article>
        <article class="panel learn-card"><div class="section-label">Controles</div><h3>Cómo usar el 3D</h3><p><b>Esfera:</b> arrastra para mover carga. <b>Fondo:</b> arrastra para girar. <b>Rueda:</b> zoom. Los botones cambian la vista de cámara.</p><p class="say">Al mover una carga, la superficie y los vectores se recalculan en tiempo real.</p></article>
      </div>
    </section>
  `,
  styles: [`
    .notice{margin:-3px 0 14px;padding:10px 13px;border-radius:6px;background:#eef5fb;border:1px solid #c7d9e9;color:#405a73;font-size:14px}.layout{display:grid;grid-template-columns:350px 1fr;gap:16px;padding-bottom:16px}.side{padding:20px}.side>label{display:block;margin:17px 0;color:#475569}.check{display:flex!important;flex-direction:row!important;align-items:center;gap:8px}.check input{width:auto}.gap{margin-top:24px}.camera{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:8px}.camera .btn{padding:9px 5px;font-size:12px}.charge-row{display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;margin:8px 0;padding:8px;border-radius:6px;background:#f8fafc;border:1px solid #dce4ec}.charge-row.active{border-color:#6f93b5;background:#edf4fa}.charge-row i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:900;color:#fff}.charge-row i.pos{background:#c84545}.charge-row i.neg{background:#2f6fab}.charge-row span{font-size:13px;color:#475569}.charge-row small{color:var(--muted)}.stage-card{overflow:hidden;min-width:0;position:relative}.toolbar{display:flex;justify-content:space-between;padding:13px 15px;border-bottom:1px solid var(--line);font-size:13px;color:var(--muted);background:#f8fafc}.stage{height:660px;background:#f7f9fb}.drag-status{position:absolute;left:50%;top:54px;transform:translateX(-50%);z-index:3;padding:8px 12px;border-radius:6px;background:rgba(255,255,255,.96);border:1px solid #bfcddd;color:var(--navy);font-size:13px;box-shadow:0 2px 6px rgba(15,23,42,.08)}.legend{display:flex;gap:18px;flex-wrap:wrap;padding:12px 14px;border-top:1px solid var(--line);font-size:12px;color:var(--muted);background:#f8fafc}.legend i{display:inline-block;width:14px;height:4px;margin-right:4px;vertical-align:middle}.red{background:#c84545}.blue{background:#2f6fab}.cyan{background:#1c7e8f}.surface{background:linear-gradient(90deg,#2f6fab,#cbd5e1,#c84545)}.learn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding-bottom:70px}.learn-card{padding:18px}.learn-card h3{margin:7px 0;color:var(--navy)}.learn-card p{font-size:13px;line-height:1.6;color:#5a6f84}.say{padding-top:8px;border-top:1px solid var(--line);color:#40556b!important}@media(max-width:930px){.layout{grid-template-columns:1fr}.stage{height:520px}.learn-grid{grid-template-columns:1fr}}
  `]
})
export class Lab3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage') stageRef!: ElementRef<HTMLDivElement>;
  density = 7; arrowScale = 1; surfaceScale = 1; showXZ = false; showVectors = true; showSurface = true; preset = 'dipolo'; charges: Charge3D[] = []; fps = 60; draggingId:number|null=null;

  private scene?: THREE.Scene; private camera?: THREE.PerspectiveCamera; private renderer?: THREE.WebGLRenderer; private controls?: OrbitControls;
  private fieldGroup = new THREE.Group(); private chargeGroup = new THREE.Group(); private surfaceGroup = new THREE.Group();
  private raf = 0; private resize?: ResizeObserver; private last = performance.now(); private frames = 0;
  private raycaster = new THREE.Raycaster(); private pointer = new THREE.Vector2(); private dragPlane = new THREE.Plane(new THREE.Vector3(0,0,1),0);

  get draggingCharge():Charge3D|undefined{return this.charges.find(c=>c.id===this.draggingId)}

  ngAfterViewInit(): void { this.init(); this.loadDipole(); this.animate(); }
  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf); this.resize?.disconnect(); this.controls?.dispose(); this.renderer?.dispose();
    const el=this.renderer?.domElement;if(el){el.removeEventListener('pointerdown',this.onPointerDown);el.removeEventListener('pointermove',this.onPointerMove);el.removeEventListener('pointerup',this.onPointerUp);el.removeEventListener('pointercancel',this.onPointerUp);}
  }

  private init(): void {
    const host = this.stageRef.nativeElement;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0xf7f9fb); this.scene.fog = new THREE.Fog(0xf7f9fb, 12, 24);
    this.camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 100); this.camera.position.set(7, 6.5, 8);
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); this.renderer.setSize(host.clientWidth, host.clientHeight); host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction='none';
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.enableDamping = true; this.controls.target.set(0, 0, 0);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.35)); const light = new THREE.DirectionalLight(0xffffff, 2.3); light.position.set(5, 8, 7); this.scene.add(light); const fill = new THREE.DirectionalLight(0xbfd7eb, 1.0); fill.position.set(-5, -4, 4); this.scene.add(fill);
    const grid = new THREE.GridHelper(10, 10, 0x8fa4b8, 0xd8e1e9); grid.rotation.x = Math.PI / 2; this.scene.add(grid); this.scene.add(new THREE.AxesHelper(3.5)); this.scene.add(this.surfaceGroup); this.scene.add(this.fieldGroup); this.scene.add(this.chargeGroup);
    this.renderer.domElement.addEventListener('pointerdown',this.onPointerDown);this.renderer.domElement.addEventListener('pointermove',this.onPointerMove);this.renderer.domElement.addEventListener('pointerup',this.onPointerUp);this.renderer.domElement.addEventListener('pointercancel',this.onPointerUp);
    this.resize = new ResizeObserver(() => { if (!this.camera || !this.renderer) return; const w = host.clientWidth, h = host.clientHeight; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); }); this.resize.observe(host);
  }

  loadDipole(): void { this.preset = 'dipolo'; this.charges = [{ id: 1, x: -1.7, y: 0, z: 0, q: 5 }, { id: 2, x: 1.7, y: 0, z: 0, q: -5 }]; this.rebuild(); }
  loadTriangle(): void { this.preset = 'triangulo'; this.charges = [{ id: 1, x: -1.6, y: -1, z: 0, q: 5 }, { id: 2, x: 1.6, y: -1, z: 0, q: 5 }, { id: 3, x: 0, y: 1.7, z: 0, q: -8 }]; this.rebuild(); }
  private rebuild(): void { this.rebuildCharges(); this.rebuildPotentialSurface(); this.rebuildField(); }
  private clearGroup(group: THREE.Group): void { while (group.children.length) { const object = group.children.pop(); if (!object) continue; const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); const material = mesh.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(material)) material.forEach(m => m.dispose()); else material?.dispose(); } }

  private rebuildCharges(): void {
    this.clearGroup(this.chargeGroup);
    for (const c of this.charges) {
      const geometry = new THREE.SphereGeometry(0.27, 28, 18); const material = new THREE.MeshStandardMaterial({ color: c.q > 0 ? 0xef4444 : 0x2563eb, emissive: c.q > 0 ? 0x4a0b0b : 0x0a2855, emissiveIntensity: 0.28, roughness: 0.35 });
      const sphere = new THREE.Mesh(geometry, material); sphere.position.set(c.x, c.y, c.z); sphere.userData['chargeId']=c.id; sphere.userData['draggable']=true; this.chargeGroup.add(sphere);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.014, 8, 40), new THREE.MeshBasicMaterial({ color: c.q > 0 ? 0xfca5a5 : 0x93c5fd, transparent: true, opacity: 0.7 })); ring.position.copy(sphere.position); this.chargeGroup.add(ring);
    }
  }

  private setPointer(event:PointerEvent):void{if(!this.renderer)return;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.x=((event.clientX-r.left)/r.width)*2-1;this.pointer.y=-((event.clientY-r.top)/r.height)*2+1}
  private onPointerDown=(event:PointerEvent):void=>{if(!this.camera||!this.renderer)return;this.setPointer(event);this.raycaster.setFromCamera(this.pointer,this.camera);const draggable=this.chargeGroup.children.filter(o=>o.userData['draggable']===true);const hit=this.raycaster.intersectObjects(draggable,false)[0];if(!hit)return;const id=hit.object.userData['chargeId'] as number|undefined;if(id===undefined)return;this.draggingId=id;if(this.controls)this.controls.enabled=false;this.renderer.domElement.setPointerCapture(event.pointerId);this.renderer.domElement.style.cursor='grabbing';event.preventDefault();}
  private onPointerMove=(event:PointerEvent):void=>{if(this.draggingId===null||!this.camera)return;this.setPointer(event);this.raycaster.setFromCamera(this.pointer,this.camera);const hit=new THREE.Vector3();if(!this.raycaster.ray.intersectPlane(this.dragPlane,hit))return;const c=this.charges.find(q=>q.id===this.draggingId);if(!c)return;c.x=Math.max(-4.4,Math.min(4.4,hit.x));c.y=Math.max(-2.8,Math.min(2.8,hit.y));c.z=0;this.rebuild();}
  private onPointerUp=(event:PointerEvent):void=>{if(this.draggingId===null)return;this.draggingId=null;if(this.controls)this.controls.enabled=true;if(this.renderer){this.renderer.domElement.style.cursor='grab';try{this.renderer.domElement.releasePointerCapture(event.pointerId)}catch{}}}

  private fieldAt(x: number, y: number, z: number): THREE.Vector3 { let ex = 0, ey = 0, ez = 0; for (const c of this.charges) { const dx = x - c.x, dy = y - c.y, dz = z - c.z, r2 = dx * dx + dy * dy + dz * dz; if (r2 < 0.08) continue; const r = Math.sqrt(r2), factor = c.q / (r2 * r); ex += factor * dx; ey += factor * dy; ez += factor * dz; } return new THREE.Vector3(ex, ey, ez); }
  private potentialAt(x: number, y: number, z: number): number { const k = 8.9875517923e9; let v = 0; for (const c of this.charges) { const r = Math.max(0.22, Math.hypot(x - c.x, y - c.y, z - c.z)); v += k * (c.q * 1e-9) / r; } return v; }

  rebuildField(): void { this.clearGroup(this.fieldGroup); if (!this.showVectors || !this.scene) return; const n = this.density, span = 4.4; for (let iy = 0; iy < n; iy++) for (let ix = 0; ix < n; ix++) { const x = -span + ix * (span * 2 / (n - 1)), y = -span + iy * (span * 2 / (n - 1)); this.addArrow(x, y, 0.12); if (this.showXZ) this.addArrow(x, 0, y); } }
  private addArrow(x: number, y: number, z: number): void { if (this.charges.some(c => Math.hypot(x - c.x, y - c.y, z - c.z) < 0.5)) return; const vector = this.fieldAt(x, y, z), magnitude = vector.length(); if (magnitude < 1e-7) return; const length = (0.28 + Math.min(0.75, Math.log10(magnitude + 1) * 0.22)) * this.arrowScale; const color = new THREE.Color().setHSL(0.52 - Math.min(0.18, Math.log10(magnitude + 1) * 0.035), 0.85, 0.58); this.fieldGroup.add(new THREE.ArrowHelper(vector.normalize(), new THREE.Vector3(x, y, z), length, color.getHex(), 0.16, 0.08)); }

  rebuildPotentialSurface(): void {
    this.clearGroup(this.surfaceGroup); if (!this.showSurface || !this.scene) return;
    const width = 8.8, height = 5.8, segX = 48, segY = 32; const geometry = new THREE.PlaneGeometry(width, height, segX, segY); const positions = geometry.attributes['position'] as THREE.BufferAttribute; const colors: number[] = [];
    for (let i = 0; i < positions.count; i++) { const x = positions.getX(i), y = positions.getY(i); const v = this.potentialAt(x, y, 0); const z = Math.tanh(v / 45) * 1.65 * this.surfaceScale; positions.setZ(i, z); const strength = Math.min(1, Math.abs(v) / 85); const neutral = new THREE.Color(0xb9c7d9); const target = new THREE.Color(v >= 0 ? 0xef4444 : 0x3b82f6); neutral.lerp(target, 0.35 + 0.65 * strength); colors.push(neutral.r, neutral.g, neutral.b); }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.computeVertexNormals(); const material = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.48, side: THREE.DoubleSide, roughness: 0.75, metalness: 0.05 }); const mesh = new THREE.Mesh(geometry, material); mesh.position.z = -0.06; this.surfaceGroup.add(mesh);
  }

  viewIso(): void { if (!this.camera) return; this.camera.up.set(0, 1, 0); this.camera.position.set(7, 6.5, 8); this.controls?.target.set(0, 0, 0); }
  viewTop(): void { if (!this.camera) return; this.camera.up.set(0, 1, 0); this.camera.position.set(0, 0, 11); this.controls?.target.set(0, 0, 0); }
  viewFront(): void { if (!this.camera) return; this.camera.up.set(0, 0, 1); this.camera.position.set(0, -11, 0); this.controls?.target.set(0, 0, 0); }
  private animate = (): void => { this.raf = requestAnimationFrame(this.animate); this.controls?.update(); const now = performance.now(); this.frames++; if (now - this.last > 1000) { this.fps = Math.round(this.frames * 1000 / (now - this.last)); this.frames = 0; this.last = now; } if (this.scene && this.camera) this.renderer?.render(this.scene, this.camera); };
}
