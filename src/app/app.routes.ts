import { Routes } from '@angular/router';
import { LandingHomePage } from './modules/landing/pages/landing-home/landing-home.page';
import { DetalleServicioPage } from './modules/servicios/pages/detalle-servicio/detalle-servicio.page';

export const routes: Routes = [
  { path: '', component: LandingHomePage },
  { path: 'servicio/:id', component: DetalleServicioPage },
  { path: '**', redirectTo: '' }
];
