import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VetDataService } from '../../../../core/services/vet-data.service';
import { Dueno } from '../../../../core/models/dueno.model';
import { Mascota } from '../../../../core/models/mascota.model';

@Component({
  selector: 'app-mascotas-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mascotas-list.html',
  styleUrl: './mascotas-list.scss'
})
export class MascotasList implements OnInit {
  mascotas: Mascota[] = [];
  duenos: Dueno[] = [];
  mascotasFiltradas: Mascota[] = [];
  
  busqueda: string = '';
  
  registroForm!: FormGroup;
  modoNuevoDueno: boolean = true;
  registroExitoso: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vetService: VetDataService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarFormulario();
  }

  cargarDatos(): void {
    this.mascotas = this.vetService.getMascotas();
    this.duenos = this.vetService.getDuenos();
    this.filtrarMascotas();
  }

  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      // Selector de dueño existente
      duenoExistenteId: [''],
      
      // Datos del dueño nuevo
      duenoNombre: ['', [Validators.required, Validators.minLength(3)]],
      duenoTelefono: ['', [Validators.required, Validators.pattern(/^[9][0-9]{8}$/)]], // Celular peruano estándar (9 dígitos)
      duenoEmail: ['', [Validators.required, Validators.email]],
      duenoDireccion: ['', [Validators.required, Validators.minLength(5)]],

      // Datos de la mascota
      mascotaNombre: ['', [Validators.required, Validators.minLength(2)]],
      mascotaEspecie: ['', [Validators.required]],
      mascotaRaza: ['', [Validators.required]],
      mascotaEdad: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      mascotaPeso: ['', [Validators.required, Validators.min(0.1), Validators.max(120)]]
    });

    // Escuchar el cambio en modo de dueño para activar/desactivar validaciones
    this.registroForm.get('duenoExistenteId')?.valueChanges.subscribe(val => {
      if (val) {
        this.modoNuevoDueno = false;
        this.desactivarValidacionesDueno();
      } else {
        this.modoNuevoDueno = true;
        this.activarValidacionesDueno();
      }
    });
  }

  activarValidacionesDueno(): void {
    const fields = ['duenoNombre', 'duenoTelefono', 'duenoEmail', 'duenoDireccion'];
    fields.forEach(f => {
      this.registroForm.get(f)?.setValidators([Validators.required]);
      if (f === 'duenoNombre') this.registroForm.get(f)?.addValidators(Validators.minLength(3));
      if (f === 'duenoTelefono') this.registroForm.get(f)?.addValidators(Validators.pattern(/^[9][0-9]{8}$/));
      if (f === 'duenoEmail') this.registroForm.get(f)?.addValidators(Validators.email);
      if (f === 'duenoDireccion') this.registroForm.get(f)?.addValidators(Validators.minLength(5));
      this.registroForm.get(f)?.updateValueAndValidity();
    });
  }

  desactivarValidacionesDueno(): void {
    const fields = ['duenoNombre', 'duenoTelefono', 'duenoEmail', 'duenoDireccion'];
    fields.forEach(f => {
      this.registroForm.get(f)?.clearValidators();
      this.registroForm.get(f)?.updateValueAndValidity();
    });
  }

  cambiarModoDueno(esNuevo: boolean): void {
    this.modoNuevoDueno = esNuevo;
    if (esNuevo) {
      this.registroForm.get('duenoExistenteId')?.setValue('');
    } else {
      // seleccionar el primer dueño si hay
      if (this.duenos.length > 0) {
        this.registroForm.get('duenoExistenteId')?.setValue(this.duenos[0].id);
      }
    }
  }

  esInvalido(controlName: string): boolean {
    const control = this.registroForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  filtrarMascotas(): void {
    const query = this.busqueda.toLowerCase().trim();
    if (!query) {
      this.mascotasFiltradas = this.mascotas;
    } else {
      this.mascotasFiltradas = this.mascotas.filter(m => {
        const dueno = this.vetService.getDuenoById(m.duenoId);
        return m.nombre.toLowerCase().includes(query) ||
               m.especie.toLowerCase().includes(query) ||
               m.raza.toLowerCase().includes(query) ||
               (dueno && dueno.nombre.toLowerCase().includes(query));
      });
    }
  }

  obtenerDuenoDeMascota(duenoId: string): Dueno | undefined {
    return this.vetService.getDuenoById(duenoId);
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const values = this.registroForm.value;
      let duenoId = '';

      if (this.modoNuevoDueno) {
        // Registrar nuevo dueño
        duenoId = 'd_' + new Date().getTime();
        const nuevoDueno = new Dueno(
          duenoId,
          values.duenoNombre,
          values.duenoTelefono,
          values.duenoEmail,
          values.duenoDireccion
        );
        this.vetService.addDueno(nuevoDueno);
      } else {
        // Usar dueño existente
        duenoId = values.duenoExistenteId;
      }

      // Registrar mascota
      const mascotaId = 'm_' + new Date().getTime();
      const nuevaMascota = new Mascota(
        mascotaId,
        values.mascotaNombre,
        values.mascotaEspecie,
        values.mascotaRaza,
        Number(values.mascotaEdad),
        Number(values.mascotaPeso),
        duenoId
      );

      this.vetService.addMascota(nuevaMascota);

      // Limpiar y notificar
      this.registroExitoso = true;
      this.registroForm.reset({
        duenoExistenteId: '',
        mascotaEspecie: '',
        mascotaEdad: '',
        mascotaPeso: ''
      });
      this.modoNuevoDueno = true;
      this.cargarDatos();

      setTimeout(() => {
        this.registroExitoso = false;
      }, 5000);
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
