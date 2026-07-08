import { Routes } from '@angular/router';
import { LandingHomePage } from './modules/landing/pages/landing-home/landing-home.page';
import { DetalleServicioPage } from './modules/servicios/pages/detalle-servicio/detalle-servicio.page';
import { MascotasList } from './modules/mascotas/pages/mascotas-list/mascotas-list';
import { CitasCalendar } from './modules/citas/pages/citas-calendar/citas-calendar';
import { HistorialClinico } from './modules/historial/pages/historial-clinico/historial-clinico';

export const routes: Routes = [
  { path: '', component: LandingHomePage },
  { path: 'servicio/:id', component: DetalleServicioPage },
  { path: 'mascotas', component: MascotasList },
  { path: 'citas', component: CitasCalendar },
  { path: 'historial', component: HistorialClinico },
  { path: '**', redirectTo: '' }
];

