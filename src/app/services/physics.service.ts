import { Injectable } from '@angular/core';
import { PointCharge, Vec2 } from '../models/physics.models';

@Injectable({ providedIn: 'root' })
export class PhysicsService {
  readonly k = 8.9875517923e9;
  readonly epsilon0 = 8.8541878128e-12;


  coulombForce(q1C: number, q2C: number, distanceM: number): number {
    const r = Math.max(1e-9, Math.abs(distanceM));
    return this.k * Math.abs(q1C * q2C) / (r * r);
  }

  electricFieldAt(x: number, y: number, charges: PointCharge[]): Vec2 {
    let ex = 0;
    let ey = 0;
    for (const c of charges) {
      const dx = x - c.x;
      const dy = y - c.y;
      const r2 = dx * dx + dy * dy;
      if (r2 < 1e-5) continue;
      const r = Math.sqrt(r2);
      const factor = this.k * (c.qNc * 1e-9) / (r2 * r);
      ex += factor * dx;
      ey += factor * dy;
    }
    return { x: ex, y: ey };
  }

  potentialAt(x: number, y: number, charges: PointCharge[]): number {
    return charges.reduce((sum, c) => {
      const r = Math.max(1e-4, Math.hypot(x - c.x, y - c.y));
      return sum + this.k * (c.qNc * 1e-9) / r;
    }, 0);
  }

  capacitance(area: number, distance: number, kappa: number): number {
    return distance > 0 ? kappa * this.epsilon0 * area / distance : 0;
  }

  capacitorCharge(capacitance: number, voltage: number): number {
    return capacitance * voltage;
  }

  capacitorEnergy(capacitance: number, voltage: number): number {
    return 0.5 * capacitance * voltage * voltage;
  }

  equivalentCapacitanceSeries(values: number[]): number {
    const valid = values.filter(v => v > 0);
    if (!valid.length) return 0;
    return 1 / valid.reduce((sum, c) => sum + 1 / c, 0);
  }

  equivalentCapacitanceParallel(values: number[]): number {
    return values.filter(v => v > 0).reduce((sum, c) => sum + c, 0);
  }
}
