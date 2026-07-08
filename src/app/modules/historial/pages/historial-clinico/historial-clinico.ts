import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VetDataService } from '../../../../core/services/vet-data.service';
import { Mascota } from '../../../../core/models/mascota.model';
import { Dueno } from '../../../../core/models/dueno.model';
import { 
  RegistroClinico, 
  RegistroVacuna, 
  RegistroTratamiento, 
  RegistroCirugia 
} from '../../../../core/models/historial.model';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './historial-clinico.html',
  styleUrl: './historial-clinico.scss'
})
export class HistorialClinico implements OnInit {
  mascotas: Mascota[] = [];
  mascotaSeleccionadaId: string = '';
  mascotaSeleccionada: Mascota | null = null;
  duenoMascota: Dueno | null = null;
  historial: RegistroClinico[] = [];

  historialForm!: FormGroup;
  tipoRegistro: 'vacuna' | 'tratamiento' | 'cirugia' = 'vacuna';
  registroExitoso: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vetService: VetDataService
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();
    this.inicializarFormulario();
  }

  cargarMascotas(): void {
    this.mascotas = this.vetService.getMascotas();
    // Seleccionar la primera mascota si hay alguna
    if (this.mascotas.length > 0) {
      this.seleccionarMascota(this.mascotas[0].id);
    }
  }

  seleccionarMascota(id: string): void {
    this.mascotaSeleccionadaId = id;
    this.mascotaSeleccionada = this.vetService.getMascotas().find(m => m.id === id) || null;
    if (this.mascotaSeleccionada) {
      this.duenoMascota = this.vetService.getDuenoById(this.mascotaSeleccionada.duenoId) || null;
      this.historial = this.vetService.getHistorialByMascota(id).sort((a, b) => {
        // Ordenar del más reciente al más antiguo
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
    } else {
      this.duenoMascota = null;
      this.historial = [];
    }
  }

  onMascotaChange(event: any): void {
    this.seleccionarMascota(event.target.value);
  }

  inicializarFormulario(): void {
    this.historialForm = this.fb.group({
      tipo: ['vacuna', [Validators.required]],
      fecha: [new Date().toISOString().split('T')[0], [Validators.required]],
      veterinario: ['', [Validators.required, Validators.minLength(3)]],
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],

      // Campos específicos Vacuna
      nombreVacuna: ['', [Validators.required]],
      lote: ['', [Validators.required]],
      proximaDosis: ['', [Validators.required]],

      // Campos específicos Tratamiento
      medicacion: [''],
      dosis: [''],
      duracionDias: [''],

      // Campos específicos Cirugía
      procedimiento: [''],
      tipoAnestesia: [''],
      cuidadosPostoperatorios: ['']
    });

    // Escuchar cambios de tipo de registro para actualizar validaciones
    this.historialForm.get('tipo')?.valueChanges.subscribe(val => {
      this.tipoRegistro = val;
      this.actualizarValidacionesDinamicas(val);
    });
  }

  actualizarValidacionesDinamicas(tipo: 'vacuna' | 'tratamiento' | 'cirugia'): void {
    // Campos de Vacuna
    const camposVacuna = ['nombreVacuna', 'lote', 'proximaDosis'];
    // Campos de Tratamiento
    const camposTratamiento = ['medicacion', 'dosis', 'duracionDias'];
    // Campos de Cirugía
    const camposCirugia = ['procedimiento', 'tipoAnestesia', 'cuidadosPostoperatorios'];

    // Limpiar todos
    [...camposVacuna, ...camposTratamiento, ...camposCirugia].forEach(f => {
      this.historialForm.get(f)?.clearValidators();
      this.historialForm.get(f)?.updateValueAndValidity();
    });

    // Activar específicos
    if (tipo === 'vacuna') {
      camposVacuna.forEach(f => {
        this.historialForm.get(f)?.setValidators([Validators.required]);
        this.historialForm.get(f)?.updateValueAndValidity();
      });
    } else if (tipo === 'tratamiento') {
      camposTratamiento.forEach(f => {
        this.historialForm.get(f)?.setValidators([Validators.required]);
        if (f === 'duracionDias') {
          this.historialForm.get(f)?.addValidators(Validators.min(1));
        }
        this.historialForm.get(f)?.updateValueAndValidity();
      });
    } else if (tipo === 'cirugia') {
      camposCirugia.forEach(f => {
        this.historialForm.get(f)?.setValidators([Validators.required]);
        this.historialForm.get(f)?.updateValueAndValidity();
      });
    }
  }

  esInvalido(controlName: string): boolean {
    const control = this.historialForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (!this.mascotaSeleccionadaId) {
      alert('Por favor selecciona una mascota primero.');
      return;
    }

    if (this.historialForm.valid) {
      const val = this.historialForm.value;
      const recordId = 'h_' + new Date().getTime();
      let nuevoRegistro: RegistroClinico;

      if (val.tipo === 'vacuna') {
        nuevoRegistro = new RegistroVacuna(
          recordId,
          this.mascotaSeleccionadaId,
          val.fecha,
          val.veterinario,
          val.diagnostico,
          val.nombreVacuna,
          val.lote,
          val.proximaDosis
        );
      } else if (val.tipo === 'tratamiento') {
        nuevoRegistro = new RegistroTratamiento(
          recordId,
          this.mascotaSeleccionadaId,
          val.fecha,
          val.veterinario,
          val.diagnostico,
          val.medicacion,
          val.dosis,
          Number(val.duracionDias)
        );
      } else {
        nuevoRegistro = new RegistroCirugia(
          recordId,
          this.mascotaSeleccionadaId,
          val.fecha,
          val.veterinario,
          val.diagnostico,
          val.procedimiento,
          val.tipoAnestesia,
          val.cuidadosPostoperatorios
        );
      }

      this.vetService.addRegistroClinico(nuevoRegistro);
      this.registroExitoso = true;

      // Resetear formulario manteniendo tipo y fecha
      this.historialForm.reset({
        tipo: val.tipo,
        fecha: new Date().toISOString().split('T')[0]
      });

      this.seleccionarMascota(this.mascotaSeleccionadaId);

      setTimeout(() => {
        this.registroExitoso = false;
      }, 5000);
    } else {
      this.historialForm.markAllAsTouched();
    }
  }
}
