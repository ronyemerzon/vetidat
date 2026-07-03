import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalAgenda } from '../../../../shared/components/modal-agenda/modal-agenda';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-landing-home',
  imports: [CommonModule, RouterLink, ModalAgenda, Footer],
  templateUrl: './landing-home.page.html',
  styleUrl: './landing-home.page.scss',
})
export class LandingHomePage {
  isAgendaModal: boolean = false;

  toggleModal(state: boolean) {
    this.isAgendaModal = state;
  }
}
