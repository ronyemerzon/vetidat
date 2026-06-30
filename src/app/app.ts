import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingHomePage } from './modules/landing/pages/landing-home/landing-home.page';

@Component({
  selector: 'app-root',
  imports: [LandingHomePage, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ProyectoInterfacesIII');
}
