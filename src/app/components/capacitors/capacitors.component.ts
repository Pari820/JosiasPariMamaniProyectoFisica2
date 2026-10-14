import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhysicsService } from '../../services/physics.service';

@Component({selector:'app-capacitors',standalone:true,imports:[CommonModule,FormsModule],template:`
<section class="page">
  <div class="lab-head"><div><div class="unit">UNIDAD 2</div><h1>Capacitores y dieléctricos</h1><p>Analiza un capacitor de placas paralelas y observa en tiempo real cómo cambian C, Q, U y E al modificar sus parámetros.</p></div><div class="formula">C = κε₀A/d · Q = CV · U = ½CV²</div></div>

  <div class="definition panel"><div><span>Definición fundamental</span><strong>C = Q / V</strong></div><p>La capacitancia mide la capacidad de un capacitor para almacenar carga por cada volt de diferencia de potencial. Su unidad en el SI es el farad (F).</p></div>

  <div class="cap-layout">
    <aside class="panel controls">
      <div class="section-label">Parámetros experimentales</div>
      <label><span class="control-label"><span>Área A</span><b>{{area.toFixed(3)}} m²</b></span><input type="range" [(ngModel)]="area" min="0.005" max="0.1" step="0.005"></label>
      <label><span class="control-label"><span>Separación d</span><b>{{(distance*1000).toFixed(1)}} mm</b></span><input type="range" [(ngModel)]="distance" min="0.0005" max="0.010" step="0.0005"></label>
      <label><span class="control-label"><span>Voltaje V</span><b>{{voltage}} V</b></span><input type="range" [(ngModel)]="voltage" min="1" max="120" step="1"></label>
      <label><span class="control-label"><span>Dieléctrico</span><b>κ={{kappa}}</b></span><select [(ngModel)]="kappa"><option [ngValue]="1">Vacío (κ=1)</option><option [ngValue]="1.00059">Aire, 1 atm (κ=1.00059)</option><option [ngValue]="2.1">Teflón (κ=2.1)</option><option [ngValue]="2.25">Polietileno (κ=2.25)</option><option [ngValue]="3.1">Mylar (κ=3.1)</option><option [ngValue]="3.4">Plexiglás (κ=3.40)</option><option [ngValue]="6.7">Neopreno (κ=6.70)</option></select></label>
      <div class="section-label gap">Qué comprobar</div>
      <p class="help">Mueve un control por vez. Manteniendo los demás parámetros fijos puedes comprobar C∝A, C∝1/d y U∝V².</p>
      <button class="btn secondary full" (click)="reset()">Restablecer valores</button>
    </aside>

    <div class="main">
      <div class="panel visual">
        <div class="cap-scene">
          <div class="plate top" [style.transform]="plateShift(-1)"><span>+ + + + + + +</span></div>
          <div class="dielectric" [style.opacity]="kappa===1?0:.68" [style.height.%]="dielectricHeight"></div>
          <div class="field"><i *ngFor="let _ of markers"></i></div>
          <div class="plate bottom" [style.transform]="plateShift(1)"><span>− − − − − − −</span></div>
          <div class="measure"><span>d = {{(distance*1000).toFixed(1)}} mm</span><i></i></div>
        </div>
        <div class="metric-grid metrics">
          <div class="metric"><span>Capacitancia</span><strong>{{formatCap(capacitance)}}</strong></div>
          <div class="metric"><span>Carga</span><strong>{{formatCharge(charge)}}</strong></div>
          <div class="metric"><span>Energía</span><strong>{{formatEnergy(energy)}}</strong></div>
          <div class="metric"><span>Campo E≈V/d</span><strong>{{electricField.toExponential(2)}} V/m</strong></div>
        </div>
        <div class="interpretation"><b>Interpretación del estado actual:</b> {{interpretation}}</div>
      </div>

      <div class="charts">
        <div class="panel chart"><div><span>C vs distancia</span><b>relación inversa</b></div><svg viewBox="0 0 320 170"><path class="grid" d="M35 10V145H310 M35 45H310 M35 90H310 M35 125H310"/><polyline [attr.points]="distancePoints"/><circle [attr.cx]="distanceMarker.x" [attr.cy]="distanceMarker.y" r="4"/><text x="6" y="18">C</text><text x="287" y="163">d</text></svg><p>Al aumentar la separación, la capacitancia disminuye.</p></div>
        <div class="panel chart"><div><span>C vs área</span><b>relación lineal</b></div><svg viewBox="0 0 320 170"><path class="grid" d="M35 10V145H310 M35 45H310 M35 90H310 M35 125H310"/><polyline [attr.points]="areaPoints"/><circle [attr.cx]="areaMarker.x" [attr.cy]="areaMarker.y" r="4"/><text x="6" y="18">C</text><text x="287" y="163">A</text></svg><p>Al aumentar el área de las placas, la capacitancia aumenta.</p></div>
        <div class="panel chart"><div><span>U vs voltaje</span><b>relación cuadrática</b></div><svg viewBox="0 0 320 170"><path class="grid" d="M35 10V145H310 M35 45H310 M35 90H310 M35 125H310"/><polyline [attr.points]="energyPoints"/><circle [attr.cx]="energyMarker.x" [attr.cy]="energyMarker.y" r="4"/><text x="6" y="18">U</text><text x="287" y="163">V</text></svg><p>La energía crece con el cuadrado del voltaje.</p></div>
      </div>

      <div class="panel energy-calc">
        <div><div class="section-label">Calculadora de energía almacenada</div><h3>U = ½CV²</h3><p>Ingresa directamente capacitancia y voltaje. También se cumple U = Q²/(2C) = ½QV.</p></div>
        <label><span>Capacitancia C (nF)</span><input type="number" [(ngModel)]="manualCapNf" min="0" step="0.1"></label>
        <label><span>Voltaje V (V)</span><input type="number" [(ngModel)]="manualVoltage" min="0" step="1"></label>
        <div class="energy-result"><span>Energía almacenada</span><strong>{{formatEnergy(manualEnergy)}}</strong><small>{{manualEnergy.toExponential(4)}} J</small></div>
      </div>

      <div class="panel equivalent-calc">
        <div class="equiv-info"><div class="section-label">Complemento de la Unidad II</div><h3>Capacitancia equivalente</h3><p>Compara dos capacitores conectados en serie o en paralelo.</p></div>
        <label><span>C₁ (nF)</span><input type="number" [(ngModel)]="c1Nf" min="0.01" step="1"></label>
        <label><span>C₂ (nF)</span><input type="number" [(ngModel)]="c2Nf" min="0.01" step="1"></label>
        <label><span>Conexión</span><select [(ngModel)]="capConnection"><option value="serie">Serie</option><option value="paralelo">Paralelo</option></select></label>
        <div class="equiv-result"><span>C equivalente</span><strong>{{equivalentCapNf.toFixed(3)}} nF</strong><small>{{capConnection==='serie'?'1/Ceq = 1/C₁ + 1/C₂':'Ceq = C₁ + C₂'}}</small></div>
      </div>

      <div class="learn-grid">
        <article class="panel learn-card"><div class="section-label">Definición</div><h3>Capacitancia</h3><div class="big-formula">C = Q/V</div><p>La capacitancia es la razón entre la magnitud de la carga almacenada y la diferencia de potencial.</p><p class="say">Un valor mayor de C significa que puede almacenarse más carga para el mismo voltaje.</p></article>
        <article class="panel learn-card"><div class="section-label">Placas paralelas</div><h3>Geometría y dieléctrico</h3><div class="big-formula">C = κε₀A/d</div><p><b>κ</b> es la constante dieléctrica, <b>A</b> el área y <b>d</b> la separación.</p><p class="say">C aumenta con A y κ, y disminuye cuando aumenta d.</p></article>
        <article class="panel learn-card"><div class="section-label">Fórmula 2</div><h3>Carga almacenada</h3><div class="big-formula">Q = CV</div><p>La carga almacenada depende de la capacitancia y del voltaje aplicado.</p><p class="say">A igual capacitancia, mayor voltaje implica mayor carga.</p></article>
        <article class="panel learn-card"><div class="section-label">Fórmula 3</div><h3>Energía almacenada</h3><div class="big-formula">U = Q²/(2C) = ½CV² = ½QV</div><p>Son tres expresiones equivalentes para la energía almacenada; se elige según los datos disponibles.</p><p class="say">Duplicar V multiplica por cuatro la energía si C permanece constante.</p></article>
        <article class="panel learn-card"><div class="section-label">Aproximación</div><h3>Campo entre placas</h3><div class="big-formula">E ≈ V/d</div><p>Para placas paralelas ideales, el campo entre ellas se aproxima dividiendo voltaje entre separación.</p><p class="say">Con el mismo voltaje, acercar las placas aumenta el campo eléctrico.</p></article>
      </div>
    </div>
  </div>
</section>`,styles:[`
.definition{display:flex;align-items:center;gap:18px;padding:13px 16px;margin:-3px 0 14px}.definition>div{display:flex;flex-direction:column;min-width:170px}.definition span{font-size:11px;text-transform:uppercase;color:var(--muted)}.definition strong{font-family:Cambria,"Times New Roman",serif;font-size:23px;color:var(--navy)}.definition p{margin:0;color:#52677e;font-size:14px;border-left:1px solid #d6e0ea;padding-left:18px}.cap-layout{display:grid;grid-template-columns:360px 1fr;gap:16px;padding-bottom:70px}.controls{padding:20px}.controls>label{display:block;margin:21px 0}.controls input[type=range]{width:100%}.gap{margin-top:30px}.full{width:100%;margin-top:8px}.main{min-width:0}.visual{padding:20px}.cap-scene{position:relative;height:330px;overflow:hidden;border-radius:7px;background:#f8fafc;border:1px solid #dce4ec;display:grid;place-items:center}.plate{position:absolute;left:20%;width:60%;height:17px;border-radius:3px;background:linear-gradient(180deg,#cbd5e1,#8898a9);transition:.2s}.plate.top{top:34%}.plate.bottom{bottom:34%}.plate span{position:absolute;width:100%;text-align:center;font-size:20px}.top span{top:-30px;color:#b84040}.bottom span{bottom:-30px;color:#2f6fab}.dielectric{position:absolute;width:54%;min-height:25px;background:rgba(101,151,190,.22);border:1px solid #86a9c8;border-radius:3px;transition:.2s}.field{position:absolute;width:53%;height:21%;display:flex;justify-content:space-around}.field i{border-left:1px dashed rgba(47,111,171,.52)}.measure{position:absolute;right:13%;top:40%;bottom:40%;display:flex;align-items:center;gap:7px;color:var(--muted);font-size:12px}.measure i{height:100%;border-left:1px solid #64748b;position:relative}.metrics{margin-top:16px}.interpretation{margin-top:12px;padding:11px 13px;border-radius:5px;background:#eef5fb;border-left:4px solid var(--blue);font-size:13px;line-height:1.55;color:#40556b}.charts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}.chart{padding:13px}.chart>div{display:flex;justify-content:space-between;font-size:13px}.chart>div b{color:var(--blue)}.chart svg{width:100%;height:auto;margin-top:5px}.chart .grid{fill:none;stroke:#dce4ec;stroke-width:1}.chart polyline{fill:none;stroke:#2f6fab;stroke-width:2.2}.chart circle{fill:#a86f1c;stroke:#fff;stroke-width:1}.chart text{font-size:10px;fill:#6b7c8f}.chart p{font-size:12px;color:var(--muted);margin:2px 0 0;line-height:1.45}.energy-calc{display:grid;grid-template-columns:1.4fr .8fr .8fr 1fr;align-items:end;gap:12px;padding:18px;margin-top:12px}.energy-calc h3{margin:5px 0 4px;color:var(--navy);font-family:Cambria,"Times New Roman",serif}.energy-calc p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}.energy-calc label,.equivalent-calc label{display:flex;flex-direction:column;gap:6px;font-size:12px;color:#475569}.energy-result,.equiv-result{padding:11px;border-radius:5px;background:#f2f7fb;border:1px solid #cfdeec;display:flex;flex-direction:column}.energy-result span,.energy-result small,.equiv-result span,.equiv-result small{font-size:10px;color:var(--muted);text-transform:uppercase}.energy-result strong,.equiv-result strong{font-size:20px;color:var(--navy)}.equivalent-calc{display:grid;grid-template-columns:1.25fr .65fr .65fr .75fr .9fr;align-items:end;gap:12px;padding:18px;margin-top:12px}.equiv-info h3{margin:5px 0 4px;color:var(--navy)}.equiv-info p{margin:0;color:var(--muted);font-size:12px}.learn-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:12px}.learn-card{grid-column:span 2}.learn-card:nth-child(4){grid-column:2/span 2}.learn-card:nth-child(5){grid-column:4/span 2}.learn-card{padding:17px}.learn-card h3{margin:7px 0 10px;color:var(--navy)}.big-formula{padding:10px;border-radius:5px;background:#eef5fb;border:1px solid #d2e0ec;color:var(--navy);font-family:Cambria,"Times New Roman",serif;font-weight:700;font-size:18px}.learn-card p{font-size:13px;line-height:1.6;color:#5a6f84}.say{padding-top:8px;border-top:1px solid var(--line);color:#40556b!important}@media(max-width:1150px){.learn-grid{grid-template-columns:1fr 1fr}.learn-card,.learn-card:nth-child(4),.learn-card:nth-child(5){grid-column:auto}.equivalent-calc{grid-template-columns:1fr 1fr 1fr}.equiv-info{grid-column:1/4}.equiv-result{grid-column:2/4}}@media(max-width:1000px){.cap-layout{grid-template-columns:1fr}.charts{grid-template-columns:1fr 1fr}.charts .chart:last-child{grid-column:span 2}.energy-calc{grid-template-columns:1fr 1fr}}@media(max-width:650px){.definition{display:block}.definition p{border-left:0;border-top:1px solid #d6e0ea;padding:10px 0 0;margin-top:8px}.charts{grid-template-columns:1fr}.charts .chart:last-child{grid-column:auto}.energy-calc,.learn-grid,.equivalent-calc{grid-template-columns:1fr}.equiv-info,.equiv-result{grid-column:auto}}
`]})
export class CapacitorsComponent{
 area=.02;distance=.001;voltage=12;kappa=1;manualCapNf=10;manualVoltage=12;c1Nf=10;c2Nf=20;capConnection:'serie'|'paralelo'='serie';markers=Array.from({length:9});readonly Math=Math;
 constructor(private physics:PhysicsService){}
 get capacitance(){return this.physics.capacitance(+this.area,+this.distance,+this.kappa)}
 get charge(){return this.capacitance*this.voltage}
 get energy(){return this.physics.capacitorEnergy(this.capacitance,this.voltage)}
 get electricField(){return this.distance>0?this.voltage/this.distance:0}
 get manualEnergy(){return this.physics.capacitorEnergy(Math.max(0,+this.manualCapNf)*1e-9,Math.max(0,+this.manualVoltage))}
 get equivalentCapNf(){const vals=[Math.max(1e-9,+this.c1Nf),Math.max(1e-9,+this.c2Nf)];return this.capConnection==='serie'?this.physics.equivalentCapacitanceSeries(vals):this.physics.equivalentCapacitanceParallel(vals)}
 get dielectricHeight(){return Math.min(24,8+this.kappa*2)}
 get interpretation(){const material=this.kappa===1?'vacío':this.kappa===1.00059?'aire a 1 atm':`un dieléctrico con κ=${this.kappa}`;return `Con A=${this.area.toFixed(3)} m², d=${(this.distance*1000).toFixed(1)} mm y ${material}, el capacitor tiene ${this.formatCap(this.capacitance)}. La energía actual es ${this.formatEnergy(this.energy)} a ${this.voltage} V.`}
 plateShift(sign:number){const px=(this.distance-.0005)/.0095*40;return `translateY(${sign*px}px)`}
 reset(){this.area=.02;this.distance=.001;this.voltage=12;this.kappa=1}
 formatCap(v:number){return v>=1e-6?(v*1e6).toFixed(3)+' µF':v>=1e-9?(v*1e9).toFixed(3)+' nF':(v*1e12).toFixed(2)+' pF'}
 formatCharge(v:number){return v>=1e-6?(v*1e6).toFixed(3)+' µC':v>=1e-9?(v*1e9).toFixed(3)+' nC':(v*1e12).toFixed(2)+' pC'}
 formatEnergy(v:number){return v>=1e-3?(v*1e3).toFixed(3)+' mJ':v>=1e-6?(v*1e6).toFixed(3)+' µJ':(v*1e9).toFixed(2)+' nJ'}
 private linePoints(n:number,fn:(t:number)=>number):string{const vals=Array.from({length:n},(_,i)=>fn(i/(n-1)));const max=Math.max(...vals,1e-20),min=Math.min(...vals);return vals.map((v,i)=>`${35+i/(n-1)*275},${145-(v-min)/(max-min||1)*125}`).join(' ')}
 get distancePoints(){return this.linePoints(35,t=>this.physics.capacitance(this.area,.0005+t*.0095,this.kappa))}
 get areaPoints(){return this.linePoints(35,t=>this.physics.capacitance(.005+t*.095,this.distance,this.kappa))}
 get energyPoints(){return this.linePoints(35,t=>this.physics.capacitorEnergy(this.capacitance,1+t*119))}
 private marker(t:number,fn:(x:number)=>number){const vals=Array.from({length:80},(_,i)=>fn(i/79));const max=Math.max(...vals,1e-20),min=Math.min(...vals),v=fn(t);return{x:35+t*275,y:145-(v-min)/(max-min||1)*125}}
 get distanceMarker(){return this.marker((this.distance-.0005)/.0095,t=>this.physics.capacitance(this.area,.0005+t*.0095,this.kappa))}
 get areaMarker(){return this.marker((this.area-.005)/.095,t=>this.physics.capacitance(.005+t*.095,this.distance,this.kappa))}
 get energyMarker(){return this.marker((this.voltage-1)/119,t=>this.physics.capacitorEnergy(this.capacitance,1+t*119))}
}
