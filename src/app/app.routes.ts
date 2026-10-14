import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ElectricFieldComponent } from './components/electric-field/electric-field.component';
import { CapacitorsComponent } from './components/capacitors/capacitors.component';
import { Lab3dComponent } from './components/lab3d/lab3d.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'unidad-1-campo-electrico', component: ElectricFieldComponent },
  { path: 'unidad-1-3d', component: Lab3dComponent },
  { path: 'unidad-2-capacitores', component: CapacitorsComponent },
  { path: '**', redirectTo: '' }
];
