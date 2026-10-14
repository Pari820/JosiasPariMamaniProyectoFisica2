import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhysicsService } from '../../services/physics.service';
import { PointCharge } from '../../models/physics.models';

@Component({selector:'app-electric-field',standalone:true,imports:[CommonModule,FormsModule],template:`
<section class="page">
  <div class="lab-head">
    <div><div class="unit">UNIDAD 1</div><h1>Campo eléctrico y potencial</h1><p>Construye distribuciones de hasta 10 cargas, arrástralas con el mouse y observa cómo cambian el campo, el potencial, las equipotenciales y la trayectoria de una carga de prueba.</p></div>
    <div class="formula">E⃗ = Σ kq r̂/r² · V = Σ kq/r</div>
  </div>

  <div class="notice"><b>Modo interactivo:</b> toma cualquier carga roja o azul con el mouse y arrástrala por el plano. Todo el campo se recalcula al instante.</div>

  <section class="panel coulomb-card">
    <div class="coulomb-info">
      <div class="section-label">Ley de Coulomb</div>
      <h2>Fuerza entre dos cargas puntuales</h2>
      <p>Permite comprobar que la fuerza es proporcional al producto de las cargas e inversamente proporcional al cuadrado de la distancia.</p>
      <div class="coulomb-formula">F = k |q₁q₂| / r²</div>
    </div>
    <label><span>q₁ (nC)</span><input type="number" [(ngModel)]="coulombQ1" step="1"></label>
    <label><span>q₂ (nC)</span><input type="number" [(ngModel)]="coulombQ2" step="1"></label>
    <label><span>r (m)</span><input type="number" [(ngModel)]="coulombR" min="0.001" step="0.1"></label>
    <div class="coulomb-result"><span>Fuerza eléctrica</span><strong>{{coulombForce.toExponential(3)}} N</strong><small>{{coulombNature}}</small></div>
  </section>

  <div class="layout">
    <aside class="panel side">
      <div class="section-label">Nueva carga</div>
      <div class="three"><label><span>q (nC)</span><input type="number" [(ngModel)]="newQ" step="1"></label><label><span>x (m)</span><input type="number" [(ngModel)]="newX" step="0.2"></label><label><span>y (m)</span><input type="number" [(ngModel)]="newY" step="0.2"></label></div>
      <button class="btn primary full" (click)="addCharge()" [disabled]="charges.length>=10">+ Agregar carga</button>
      <div class="presets"><button class="btn secondary" (click)="presetDipole()">Dipolo</button><button class="btn secondary" (click)="presetQuadrupole()">Cuadrupolo</button><button class="btn secondary" (click)="clear()">Limpiar</button></div>

      <div class="section-label space">Capas de visualización</div>
      <label class="check"><input type="checkbox" [(ngModel)]="showHeat" (change)="draw()"> Mapa de potencial</label>
      <label class="check"><input type="checkbox" [(ngModel)]="showVectors" (change)="draw()"> Vectores de campo</label>
      <label class="check"><input type="checkbox" [(ngModel)]="showFieldLines" (change)="draw()"> Líneas de campo</label>
      <label class="check"><input type="checkbox" [(ngModel)]="showEquip" (change)="draw()"> Equipotenciales</label>

      <div class="section-label space">Cargas ({{charges.length}}/10)</div>
      <div class="charge-list">
        <div class="charge" *ngFor="let c of charges" [class.selected]="selectedChargeId===c.id" (click)="selectCharge(c.id)">
          <i [class.pos]="c.qNc>=0" [class.neg]="c.qNc<0">{{c.qNc>=0?'+':'−'}}</i>
          <span><b>{{c.qNc}} nC</b><small>x={{c.x.toFixed(2)}}, y={{c.y.toFixed(2)}}</small></span>
          <button (click)="remove(c.id); $event.stopPropagation()">×</button>
        </div>
      </div>
      <div class="edit-charge" *ngIf="selectedCharge as sc">
        <div class="section-label">Editar carga seleccionada</div>
        <div class="three"><label><span>q (nC)</span><input type="number" [(ngModel)]="sc.qNc" (input)="chargeChanged()" step="1"></label><label><span>x</span><input type="number" [(ngModel)]="sc.x" (input)="chargeChanged()" step="0.1"></label><label><span>y</span><input type="number" [(ngModel)]="sc.y" (input)="chargeChanged()" step="0.1"></label></div>
      </div>

      <div class="section-label space">Calculadora de campo y potencial</div>
      <div class="two"><label><span>x del punto (m)</span><input type="number" [(ngModel)]="calcX" step="0.1"></label><label><span>y del punto (m)</span><input type="number" [(ngModel)]="calcY" step="0.1"></label></div>
      <button class="btn secondary full" (click)="calculatePoint()">Calcular E y V en el punto</button>
      <div class="point-result" *ngIf="pointResult">
        <div><span>V</span><b>{{pointResult.v.toFixed(3)}} V</b></div><div><span>|E|</span><b>{{formatField(pointResult.e)}} N/C</b></div><div><span>Eₓ</span><b>{{formatField(pointResult.ex)}} N/C</b></div><div><span>Eᵧ</span><b>{{formatField(pointResult.ey)}} N/C</b></div>
      </div>

      <div class="section-label space">Simulador de trayectoria</div>
      <div class="mini-explain"><b>¿Qué es una partícula de prueba?</b><span>Es una carga pequeña que usamos para observar cómo actuaría el campo eléctrico sobre ella. Su movimiento se calcula con F⃗=qE⃗ y a⃗=F⃗/m.</span></div>
      <div class="two"><label><span>q de prueba (nC)</span><input type="number" [(ngModel)]="particleQ"></label><label><span>m (×10⁻⁶ kg)</span><input type="number" [(ngModel)]="particleM" step="0.2"></label></div>
      <div class="two"><label><span>vx inicial (m/s)</span><input type="number" [(ngModel)]="particleVx" step="0.2"></label><label><span>vy inicial (m/s)</span><input type="number" [(ngModel)]="particleVy" step="0.2"></label></div>
      <button class="btn primary full" (click)="simulateParticle()">Lanzar partícula de prueba</button>
    </aside>

    <div class="panel canvas-card">
      <div class="toolbar"><span>Plano XY · −5 m a +5 m</span><span>Arrastra una carga para cambiar su posición · mueve el cursor para medir</span></div>
      <canvas #canvas width="1000" height="620"
        (mousedown)="pointerDown($event)" (mousemove)="pointerMove($event)" (mouseup)="pointerUp()" (mouseleave)="pointerLeave()"></canvas>
      <div class="probe" *ngIf="hover && draggingId===null"><div><span>Coordenada</span><b>({{hover.x.toFixed(2)}}, {{hover.y.toFixed(2)}}) m</b></div><div><span>|E|</span><b>{{sci(hover.e)}} N/C</b></div><div><span>Ex</span><b>{{sci(hover.ex)}}</b></div><div><span>Ey</span><b>{{sci(hover.ey)}}</b></div><div><span>V</span><b>{{hover.v.toFixed(2)}} V</b></div></div>
      <div class="drag-readout" *ngIf="draggingCharge as dc">Moviendo {{dc.qNc}} nC → ({{dc.x.toFixed(2)}}, {{dc.y.toFixed(2)}}) m</div>
      <div class="legend"><span><i class="red"></i> potencial +</span><span><i class="blue"></i> potencial −</span><span><i class="cyan"></i> línea de campo</span><span><i class="white"></i> equipotencial</span><span><i class="yellow"></i> partícula de prueba</span></div>
    </div>
  </div>

  <section class="learn-grid">
    <article class="panel learn-card"><div class="section-label">Base de la unidad</div><h3>Ley de Coulomb</h3><div class="big-formula">F = k|q₁q₂|/r²</div><p>Las cargas del mismo signo se repelen y las de signo contrario se atraen. La fuerza actúa sobre la línea que une las cargas.</p><p class="say">Al duplicar la distancia, la fuerza se reduce a la cuarta parte.</p></article>
    <article class="panel learn-card"><div class="section-label">Fórmula 1</div><h3>Campo eléctrico</h3><div class="big-formula">E = k|q|/r²</div><p><b>E</b> es el campo eléctrico (N/C), <b>q</b> la carga fuente (C), <b>r</b> la distancia (m) y <b>k ≈ 8.99×10⁹ N·m²/C²</b>.</p><p class="say">Cuanto más lejos estamos de una carga, el campo disminuye con el cuadrado de la distancia.</p></article>
    <article class="panel learn-card"><div class="section-label">Fórmula 2</div><h3>Principio de superposición</h3><div class="big-formula">E⃗total = E⃗₁ + E⃗₂ + ⋯</div><p>Si hay varias cargas, el programa calcula el aporte de cada una y suma vectorialmente todos los campos.</p><p class="say">Por eso, cuando se arrastra una carga cambian inmediatamente todas las flechas y líneas.</p></article>
    <article class="panel learn-card"><div class="section-label">Fórmula 3</div><h3>Potencial eléctrico</h3><div class="big-formula">V = Σ kq/r</div><p>El potencial es una magnitud <b>escalar</b>. Los tonos rojos representan potencial positivo y los azules potencial negativo.</p><p class="say">El campo tiene dirección; el potencial solo tiene un valor en cada punto.</p></article>
    <article class="panel learn-card"><div class="section-label">Fórmula 4</div><h3>Movimiento de la carga de prueba</h3><div class="big-formula">F⃗ = qE⃗    a⃗ = F⃗/m</div><p>El programa calcula la fuerza, luego la aceleración y actualiza sucesivamente velocidad y posición para dibujar la trayectoria.</p><p class="say">Una carga positiva acelera en el sentido del campo y una negativa en sentido contrario.</p></article>
  </section>
</section>`,styles:[`
.notice{margin:-3px 0 14px;padding:10px 13px;border-radius:6px;background:#eef5fb;border:1px solid #c7d9e9;color:#405a73;font-size:13px}.coulomb-card{display:grid;grid-template-columns:1.6fr .65fr .65fr .65fr .9fr;gap:12px;align-items:end;padding:18px;margin-bottom:14px}.coulomb-info h2{margin:4px 0 5px;font-size:20px;color:var(--navy)}.coulomb-info p{margin:0;color:var(--muted);font-size:13px;line-height:1.5}.coulomb-formula{display:inline-block;margin-top:8px;padding:6px 9px;background:#eef5fb;border:1px solid #cfdeec;border-radius:5px;color:var(--navy);font-family:Cambria,"Times New Roman",serif;font-size:19px}.coulomb-card label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:#475569}.coulomb-result{padding:10px 11px;border:1px solid #cfdbe7;border-radius:6px;background:#f8fafc;display:flex;flex-direction:column}.coulomb-result span{font-size:10px;text-transform:uppercase;color:var(--muted)}.coulomb-result strong{font-size:18px;color:var(--navy)}.coulomb-result small{font-size:11px;color:#52677e;margin-top:3px}.layout{display:grid;grid-template-columns:390px 1fr;gap:16px;padding-bottom:18px}.side{padding:20px;max-height:860px;overflow:auto}.side label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:#475569}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:9px 0}.two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.full{width:100%}.presets{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.presets .btn{padding:8px 4px;font-size:12px}.space{margin-top:20px}.check{flex-direction:row!important;align-items:center;gap:9px!important;margin:9px 0!important;font-size:12px!important}.check input{width:auto}.charge-list{display:flex;flex-direction:column;gap:6px;max-height:170px;overflow:auto;margin-top:8px}.charge{display:grid;grid-template-columns:32px 1fr 25px;align-items:center;gap:8px;padding:8px;border-radius:6px;background:#f8fafc;border:1px solid #dce4ec;cursor:pointer}.charge.selected{border-color:#6f93b5;background:#edf4fa}.charge i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:900;color:#fff}.charge i.pos{background:#c84545}.charge i.neg{background:#2f6fab}.charge span{display:flex;flex-direction:column}.charge small{color:var(--muted)}.charge button{border:0;background:none;color:#7b8b9c;font-size:19px;cursor:pointer}.edit-charge{margin-top:9px;padding:10px;border-radius:6px;background:#f2f7fb;border:1px solid #cfdeec}.point-result{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.point-result div{padding:8px;border-radius:5px;background:#f8fafc;border:1px solid #dce4ec;display:flex;flex-direction:column}.point-result span{font-size:10px;color:var(--muted);text-transform:uppercase}.point-result b{font-size:13px;color:var(--navy)}.mini-explain{display:flex;flex-direction:column;gap:4px;padding:9px;margin:7px 0;border-radius:6px;background:#fff8e8;border:1px solid #ead7aa;font-size:12px;line-height:1.5;color:#5f5a4c}.mini-explain b{color:#805d20}.canvas-card{overflow:hidden;position:relative}.toolbar{display:flex;justify-content:space-between;padding:12px 15px;border-bottom:1px solid var(--line);font-size:12px;color:var(--muted);background:#f8fafc}canvas{width:100%;height:auto;display:block;background:#fff;cursor:crosshair}.probe{position:absolute;left:14px;bottom:46px;display:flex;gap:8px;flex-wrap:wrap;padding:9px;background:rgba(255,255,255,.95);border:1px solid #cfdbe7;border-radius:7px;box-shadow:0 2px 7px rgba(15,23,42,.08)}.probe div{min-width:90px;display:flex;flex-direction:column}.probe span{font-size:10px;color:var(--muted);text-transform:uppercase}.probe b{font-size:13px;color:var(--navy)}.drag-readout{position:absolute;top:52px;left:50%;transform:translateX(-50%);padding:8px 12px;border-radius:6px;background:rgba(255,255,255,.96);border:1px solid #bfcddd;font-size:13px;color:var(--navy);box-shadow:0 2px 6px rgba(15,23,42,.08)}.legend{display:flex;gap:15px;flex-wrap:wrap;padding:10px 14px;font-size:12px;color:var(--muted);border-top:1px solid var(--line);background:#f8fafc}.legend i{display:inline-block;width:16px;height:3px;vertical-align:middle;margin-right:4px}.red{background:#c84545}.blue{background:#2f6fab}.cyan{background:#1c7e8f}.white{background:#64748b}.yellow{background:#b7791f}.learn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:0 0 70px}.learn-card{padding:18px}.learn-card h3{margin:7px 0 10px;color:var(--navy)}.big-formula{padding:10px;border-radius:5px;background:#eef5fb;border:1px solid #d2e0ec;color:var(--navy);font-family:Cambria,"Times New Roman",serif;font-weight:700;font-size:19px}.learn-card p{font-size:13px;line-height:1.6;color:#5a6f84}.learn-card .say{padding-top:9px;border-top:1px solid var(--line);color:#40556b}@media(max-width:1150px){.coulomb-card{grid-template-columns:1.4fr repeat(3,.7fr);}.coulomb-result{grid-column:2/5}.learn-grid{grid-template-columns:1fr 1fr}}@media(max-width:940px){.layout{grid-template-columns:1fr}.side{max-height:none}.canvas-card{min-width:0}.coulomb-card{grid-template-columns:1fr 1fr}.coulomb-info{grid-column:1/3}.coulomb-result{grid-column:auto}}@media(max-width:620px){.learn-grid,.coulomb-card{grid-template-columns:1fr}.coulomb-info{grid-column:auto}.three{grid-template-columns:1fr}.toolbar{gap:8px;flex-direction:column}}
`]})
export class ElectricFieldComponent implements AfterViewInit,OnDestroy{
 @ViewChild('canvas') canvasRef!:ElementRef<HTMLCanvasElement>;
 charges:PointCharge[]=[]; newQ=5; newX=-1.5; newY=0; showHeat=true; showVectors=true; showFieldLines=true; showEquip=true;
 calcX=0; calcY=1; pointResult:{e:number;ex:number;ey:number;v:number}|null=null;
 particleQ=1; particleM=1; particleVx=1.4; particleVy=0; particlePath:{x:number;y:number}[]=[]; hover:{x:number;y:number;e:number;ex:number;ey:number;v:number}|null=null;
 selectedChargeId:number|null=null; draggingId:number|null=null;
 coulombQ1=2; coulombQ2=-3; coulombR=0.5;
 private id=1; private alive=true;
 constructor(private physics:PhysicsService){}
 ngAfterViewInit():void{this.presetDipole()}
 ngOnDestroy():void{this.alive=false}
 get selectedCharge():PointCharge|undefined{return this.charges.find(c=>c.id===this.selectedChargeId)}
 get draggingCharge():PointCharge|undefined{return this.charges.find(c=>c.id===this.draggingId)}
 get coulombForce():number{return this.physics.coulombForce(+this.coulombQ1*1e-9,+this.coulombQ2*1e-9,+this.coulombR)}
 get coulombNature():string{const product=(+this.coulombQ1)*(+this.coulombQ2);if(product>0)return 'Repulsión: las cargas tienen el mismo signo';if(product<0)return 'Atracción: las cargas tienen signos opuestos';return 'Sin fuerza eléctrica: una de las cargas es cero'}
 addCharge():void{if(this.charges.length>=10)return;const charge={id:this.id++,x:this.clamp(+this.newX,-5,5),y:this.clamp(+this.newY,-3.1,3.1),qNc:+this.newQ};this.charges=[...this.charges,charge];this.selectedChargeId=charge.id;this.afterChargeMove()}
 remove(id:number):void{this.charges=this.charges.filter(c=>c.id!==id);if(this.selectedChargeId===id)this.selectedChargeId=null;this.afterChargeMove()}
 clear():void{this.charges=[];this.selectedChargeId=null;this.afterChargeMove()}
 presetDipole():void{this.charges=[{id:this.id++,x:-1.6,y:0,qNc:5},{id:this.id++,x:1.6,y:0,qNc:-5}];this.selectedChargeId=this.charges[0].id;this.afterChargeMove()}
 presetQuadrupole():void{this.charges=[{id:this.id++,x:-1.6,y:1.4,qNc:5},{id:this.id++,x:1.6,y:1.4,qNc:-5},{id:this.id++,x:-1.6,y:-1.4,qNc:-5},{id:this.id++,x:1.6,y:-1.4,qNc:5}];this.selectedChargeId=this.charges[0].id;this.afterChargeMove()}
 selectCharge(id:number):void{this.selectedChargeId=id;this.draw()}
 chargeChanged():void{const c=this.selectedCharge;if(c){c.x=this.clamp(+c.x,-5,5);c.y=this.clamp(+c.y,-3.1,3.1);c.qNc=+c.qNc;}this.afterChargeMove()}
 private afterChargeMove():void{this.particlePath=[];if(this.pointResult)this.calculatePoint();this.draw()}
 private clamp(v:number,min:number,max:number):number{return Math.max(min,Math.min(max,v))}
 private round2(v:number):number{return Math.round(v*100)/100}
 private world(px:number,py:number,w:number,h:number){return{x:px/w*10-5,y:3.1-py/h*6.2}}
 private screen(x:number,y:number,w:number,h:number){return{x:(x+5)/10*w,y:(3.1-y)/6.2*h}}
 private eventPoint(ev:MouseEvent):{px:number;py:number;x:number;y:number}{const c=this.canvasRef.nativeElement,r=c.getBoundingClientRect(),px=(ev.clientX-r.left)*c.width/r.width,py=(ev.clientY-r.top)*c.height/r.height,p=this.world(px,py,c.width,c.height);return{px,py,x:p.x,y:p.y}}
 pointerDown(ev:MouseEvent):void{const p=this.eventPoint(ev),c=this.canvasRef.nativeElement;let best:PointCharge|undefined;let bestPx=28;for(const q of this.charges){const s=this.screen(q.x,q.y,c.width,c.height),d=Math.hypot(s.x-p.px,s.y-p.py);if(d<bestPx){best=q;bestPx=d}}if(best){this.draggingId=best.id;this.selectedChargeId=best.id;c.style.cursor='grabbing';this.hover=null;ev.preventDefault();this.draw()}else{this.updateProbe(ev)}}
 pointerMove(ev:MouseEvent):void{if(this.draggingId!==null){const p=this.eventPoint(ev),q=this.charges.find(c=>c.id===this.draggingId);if(q){q.x=this.round2(this.clamp(p.x,-4.95,4.95));q.y=this.round2(this.clamp(p.y,-3.05,3.05));this.afterChargeMove()}return}this.updateProbe(ev)}
 pointerUp():void{if(this.draggingId!==null){this.draggingId=null;this.canvasRef.nativeElement.style.cursor='crosshair';this.draw()}}
 pointerLeave():void{this.hover=null;this.pointerUp()}
 private updateProbe(ev:MouseEvent):void{const p=this.eventPoint(ev),e=this.physics.electricFieldAt(p.x,p.y,this.charges);this.hover={x:p.x,y:p.y,ex:e.x,ey:e.y,e:Math.hypot(e.x,e.y),v:this.physics.potentialAt(p.x,p.y,this.charges)}}
 draw():void{if(!this.canvasRef||!this.alive)return;const c=this.canvasRef.nativeElement,ctx=c.getContext('2d');if(!ctx)return;const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);
   if(this.showHeat&&this.charges.length){const step=12;for(let py=0;py<h;py+=step){for(let px=0;px<w;px+=step){const p=this.world(px+step/2,py+step/2,w,h),v=this.physics.potentialAt(p.x,p.y,this.charges);const a=Math.min(.42,Math.log10(Math.abs(v)+1)*.095);ctx.fillStyle=v>=0?`rgba(200,69,69,${a*.72})`:`rgba(47,111,171,${a*.72})`;ctx.fillRect(px,py,step+1,step+1)}}}
   this.drawGrid(ctx,w,h); if(this.showEquip)this.drawEquipotential(ctx,w,h); if(this.showFieldLines)this.drawLines(ctx,w,h); if(this.showVectors)this.drawVectors(ctx,w,h); this.drawCharges(ctx,w,h); this.drawParticle(ctx,w,h);
 }
 private drawGrid(ctx:CanvasRenderingContext2D,w:number,h:number):void{ctx.lineWidth=1;for(let x=-5;x<=5;x++){const a=this.screen(x,-3.1,w,h),b=this.screen(x,3.1,w,h);ctx.strokeStyle=x===0?'rgba(71,85,105,.45)':'rgba(148,163,184,.22)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}for(let y=-3;y<=3;y++){const a=this.screen(-5,y,w,h),b=this.screen(5,y,w,h);ctx.strokeStyle=y===0?'rgba(71,85,105,.45)':'rgba(148,163,184,.22)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
 private drawVectors(ctx:CanvasRenderingContext2D,w:number,h:number):void{ctx.strokeStyle='rgba(47,111,171,.72)';ctx.fillStyle='rgba(47,111,171,.88)';ctx.lineWidth=1;for(let py=28;py<h;py+=46){for(let px=28;px<w;px+=46){const p=this.world(px,py,w,h),e=this.physics.electricFieldAt(p.x,p.y,this.charges),m=Math.hypot(e.x,e.y);if(m<1e-9)continue;const ux=e.x/m,uy=-e.y/m,l=9+Math.min(12,Math.log10(m+1)*2);const x2=px+ux*l,y2=py+uy*l;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-py,x2-px);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-4*Math.cos(a-.55),y2-4*Math.sin(a-.55));ctx.lineTo(x2-4*Math.cos(a+.55),y2-4*Math.sin(a+.55));ctx.closePath();ctx.fill()}}}
 private drawLines(ctx:CanvasRenderingContext2D,w:number,h:number):void{ctx.strokeStyle='rgba(28,126,143,.82)';ctx.lineWidth=1.25;const positives=this.charges.filter(c=>c.qNc>0);for(const source of positives){const seeds=Math.min(18,Math.max(8,Math.round(Math.abs(source.qNc)*1.8)));for(let s=0;s<seeds;s++){const a=s/seeds*Math.PI*2;let x=source.x+.12*Math.cos(a),y=source.y+.12*Math.sin(a);ctx.beginPath();let p=this.screen(x,y,w,h);ctx.moveTo(p.x,p.y);for(let i=0;i<500;i++){const e=this.physics.electricFieldAt(x,y,this.charges),m=Math.hypot(e.x,e.y);if(m<1e-8)break;const ds=.035;x+=e.x/m*ds;y+=e.y/m*ds;if(x<-5.1||x>5.1||y<-3.2||y>3.2)break;const nearNeg=this.charges.some(c=>c.qNc<0&&Math.hypot(x-c.x,y-c.y)<.12);p=this.screen(x,y,w,h);ctx.lineTo(p.x,p.y);if(nearNeg)break}ctx.stroke()}}}
 private drawEquipotential(ctx:CanvasRenderingContext2D,w:number,h:number):void{if(!this.charges.length)return;const levels=[-80,-40,-20,-10,10,20,40,80];const cols=52,rows=32,dx=10/cols,dy=6.2/rows;ctx.lineWidth=.8;for(const level of levels){ctx.strokeStyle=level>0?'rgba(184,72,72,.5)':'rgba(61,110,165,.5)';for(let j=0;j<rows;j++){for(let i=0;i<cols;i++){const x0=-5+i*dx,y0=-3.1+j*dy;const vals=[this.physics.potentialAt(x0,y0,this.charges)-level,this.physics.potentialAt(x0+dx,y0,this.charges)-level,this.physics.potentialAt(x0+dx,y0+dy,this.charges)-level,this.physics.potentialAt(x0,y0+dy,this.charges)-level];const pts:{x:number;y:number}[]=[];const edges:[[number,number],[number,number]][]=[[[0,0],[1,0]],[[1,0],[1,1]],[[1,1],[0,1]],[[0,1],[0,0]]];const ids:[[number,number],[number,number],[number,number],[number,number]]=[[0,1],[1,2],[2,3],[3,0]];for(let e=0;e<4;e++){const [a,b]=ids[e];if((vals[a]<=0&&vals[b]>0)||(vals[a]>0&&vals[b]<=0)){const t=vals[a]/(vals[a]-vals[b]);const [[ax,ay],[bx,by]]=edges[e];pts.push({x:x0+(ax+(bx-ax)*t)*dx,y:y0+(ay+(by-ay)*t)*dy})}}if(pts.length>=2){const a=this.screen(pts[0].x,pts[0].y,w,h),b=this.screen(pts[1].x,pts[1].y,w,h);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}}}
 private drawCharges(ctx:CanvasRenderingContext2D,w:number,h:number):void{for(const q of this.charges){const p=this.screen(q.x,q.y,w,h);if(q.id===this.selectedChargeId){ctx.beginPath();ctx.arc(p.x,p.y,21,0,Math.PI*2);ctx.strokeStyle='rgba(23,54,93,.9)';ctx.lineWidth=2;ctx.stroke()}ctx.beginPath();ctx.arc(p.x,p.y,15,0,Math.PI*2);ctx.fillStyle=q.qNc>=0?'#ef4444':'#2563eb';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#ffffff';ctx.font='bold 16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(q.qNc>=0?'+':'−',p.x,p.y)}}
 calculatePoint():void{const e=this.physics.electricFieldAt(+this.calcX,+this.calcY,this.charges);this.pointResult={ex:e.x,ey:e.y,e:Math.hypot(e.x,e.y),v:this.physics.potentialAt(+this.calcX,+this.calcY,this.charges)}}
 simulateParticle():void{let x=-4.4,y=-2.2,vx=this.particleVx,vy=this.particleVy;const q=this.particleQ*1e-9,m=Math.max(.05,this.particleM)*1e-6,dt=.004;const path:{x:number;y:number}[]=[{x,y}];for(let i=0;i<5000;i++){const e=this.physics.electricFieldAt(x,y,this.charges);vx+=q*e.x/m*dt;vy+=q*e.y/m*dt;x+=vx*dt;y+=vy*dt;path.push({x,y});if(x<-5||x>5||y<-3.1||y>3.1||this.charges.some(c=>Math.hypot(x-c.x,y-c.y)<.18))break}this.particlePath=path;this.draw()}
 private drawParticle(ctx:CanvasRenderingContext2D,w:number,h:number):void{if(this.particlePath.length<2)return;ctx.strokeStyle='#b7791f';ctx.lineWidth=2.6;ctx.beginPath();let p=this.screen(this.particlePath[0].x,this.particlePath[0].y,w,h);ctx.moveTo(p.x,p.y);for(const a of this.particlePath){p=this.screen(a.x,a.y,w,h);ctx.lineTo(p.x,p.y)}ctx.stroke();const first=this.screen(this.particlePath[0].x,this.particlePath[0].y,w,h);ctx.fillStyle='#fff';ctx.strokeStyle='#b7791f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(first.x,first.y,6,0,Math.PI*2);ctx.fill();ctx.stroke();const last=this.particlePath[this.particlePath.length-1],prev=this.particlePath[Math.max(0,this.particlePath.length-8)];const end=this.screen(last.x,last.y,w,h),before=this.screen(prev.x,prev.y,w,h);ctx.fillStyle='#d69e2e';ctx.beginPath();ctx.arc(end.x,end.y,7,0,Math.PI*2);ctx.fill();const ang=Math.atan2(end.y-before.y,end.x-before.x);ctx.beginPath();ctx.moveTo(end.x,end.y);ctx.lineTo(end.x-14*Math.cos(ang-.45),end.y-14*Math.sin(ang-.45));ctx.lineTo(end.x-14*Math.cos(ang+.45),end.y-14*Math.sin(ang+.45));ctx.closePath();ctx.fill()}
 formatField(n:number):string{if(!Number.isFinite(n))return '∞';const a=Math.abs(n);if(a===0)return '0.00';if(a>=0.01&&a<10000)return n.toFixed(a<10?2:1);return n.toExponential(2)}
 sci(n:number):string{return Number.isFinite(n)?n.toExponential(2):'∞'}
}
