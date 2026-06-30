import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-agenda',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agenda.html',
  styleUrl: './modal-agenda.scss',
})
export class ModalAgenda {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  agendaForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.agendaForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(3)]],
      ownerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]], // 9 dígitos númericos
      ownerEmail: ['', [Validators.required, Validators.email]],
      // Datos de la mascota
      petName: ['', [Validators.required]],
      petType: ['', [Validators.required]],
      // Datos de la cita
      fechaCita: ['', [Validators.required]],
      horaCita: ['', [Validators.required]],
    });
  }

  esInvalido(controlName: string): boolean {
    const control = this.agendaForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onClose(): void {
    this.closeModal.emit();
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.agendaForm.valid){
      console.log('Datos enviados con éxito: ', this.agendaForm.value);
      // Aquí procesaremos los datos o los mandaremos a un servicio más adelante
      this.onClose();
    } else {
      this.agendaForm.markAllAsTouched(); // Forzar la muestra de errores visuales
    }
  }
}
