import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalAgenda } from '../../../../shared/components/modal-agenda/modal-agenda';

@Component({
  selector: 'app-landing-home',
  imports: [CommonModule, RouterLink, ModalAgenda],
  templateUrl: './landing-home.page.html',
  styleUrl: './landing-home.page.scss',
})
export class LandingHomePage {
  isAgendaModal: boolean = false;

  toggleModal(state: boolean) {
    this.isAgendaModal = state;
  }
}
