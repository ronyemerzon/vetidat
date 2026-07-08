import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VetDataService } from '../../../core/services/vet-data.service';
import { Dueno } from '../../../core/models/dueno.model';
import { Mascota } from '../../../core/models/mascota.model';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-modal-agenda',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agenda.html',
  styleUrl: './modal-agenda.scss',
})
export class ModalAgenda {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() appointmentAdded = new EventEmitter<void>(); // Emitir evento al agregar una cita

  agendaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vetService: VetDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.agendaForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(3)]],
      ownerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]], // 9 dígitos numéricos
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
  }

  onSubmit(): void {
    if (this.agendaForm.valid){
      const val = this.agendaForm.value;
      
      // 1. Buscar o crear dueño
      const duenos = this.vetService.getDuenos();
      let dueno = duenos.find(d => d.email.toLowerCase() === val.ownerEmail.toLowerCase() || d.telefono === val.ownerPhone);
      
      if (!dueno) {
        const newId = 'd_' + new Date().getTime();
        dueno = new Dueno(newId, val.ownerName, val.ownerPhone, val.ownerEmail, 'Dirección no especificada');
        this.vetService.addDueno(dueno);
      }

      // 2. Buscar o crear mascota
      const mascotas = this.vetService.getMascotasByDueno(dueno.id);
      let mascota = mascotas.find(m => m.nombre.toLowerCase() === val.petName.toLowerCase());
      
      if (!mascotas || !mascota) {
        const petId = 'm_' + new Date().getTime();
        mascota = new Mascota(petId, val.petName, val.petType, 'Mestizo', 1, 5.0, dueno.id);
        this.vetService.addMascota(mascota);
      }

      // 3. Crear cita
      const citaId = 'c_' + new Date().getTime();
      const nuevaCita = new Cita(
        citaId,
        dueno.id,
        mascota.id,
        val.fechaCita,
        val.horaCita,
        'Consulta agendada desde sitio web',
        'pendiente'
      );

      this.vetService.addCita(nuevaCita);
      this.appointmentAdded.emit(); // Notificar que se agregó una cita
      
      console.log('Cita agendada con éxito: ', nuevaCita);
      this.agendaForm.reset();
      this.onClose();
    } else {
      this.agendaForm.markAllAsTouched();
    }
  }
}
