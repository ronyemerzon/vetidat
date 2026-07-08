import { Injectable } from '@angular/core';
import { Dueno } from '../models/dueno.model';
import { Mascota } from '../models/mascota.model';
import { Cita, EstadoCita } from '../models/cita.model';
import { RegistroClinico, RegistroVacuna, RegistroTratamiento, RegistroCirugia } from '../models/historial.model';

@Injectable({
  providedIn: 'root'
})
export class VetDataService {
  private readonly STORAGE_DUENOS = 'vet_duenos';
  private readonly STORAGE_MASCOTAS = 'vet_mascotas';
  private readonly STORAGE_CITAS = 'vet_citas';
  private readonly STORAGE_HISTORIAL = 'vet_historial';

  constructor() {
    this.inicializarDatosSemilla();
  }

  // --- DUEÑOS ---
  getDuenos(): Dueno[] {
    const raw = localStorage.getItem(this.STORAGE_DUENOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map(item => {
      const dueno = new Dueno(item.id, item.nombre, item.telefono, item.email, item.direccion);
      dueno.mascotasIds = item.mascotasIds || [];
      return dueno;
    });
  }

  getDuenoById(id: string): Dueno | undefined {
    return this.getDuenos().find(d => d.id === id);
  }

  addDueno(dueno: Dueno): void {
    const duenos = this.getDuenos();
    duenos.push(dueno);
    this.saveDuenos(duenos);
  }

  private saveDuenos(duenos: Dueno[]): void {
    localStorage.setItem(this.STORAGE_DUENOS, JSON.stringify(duenos));
  }

  // --- MASCOTAS ---
  getMascotas(): Mascota[] {
    const raw = localStorage.getItem(this.STORAGE_MASCOTAS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map(item => {
      return new Mascota(item.id, item.nombre, item.especie, item.raza, item.edad, item.peso, item.duenoId);
    });
  }

  getMascotasByDueno(duenoId: string): Mascota[] {
    return this.getMascotas().filter(m => m.duenoId === duenoId);
  }

  addMascota(mascota: Mascota): void {
    const mascotas = this.getMascotas();
    mascotas.push(mascota);
    this.saveMascotas(mascotas);

    // Asociar al dueño
    const duenos = this.getDuenos();
    const dueno = duenos.find(d => d.id === mascota.duenoId);
    if (dueno) {
      dueno.mascotasIds.push(mascota.id);
      this.saveDuenos(duenos);
    }
  }

  private saveMascotas(mascotas: Mascota[]): void {
    localStorage.setItem(this.STORAGE_MASCOTAS, JSON.stringify(mascotas));
  }

  // --- CITAS ---
  getCitas(): Cita[] {
    const raw = localStorage.getItem(this.STORAGE_CITAS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map(item => {
      return new Cita(item.id, item.duenoId, item.mascotaId, item.fecha, item.hora, item.motivo, item.estado);
    });
  }

  addCita(cita: Cita): void {
    const citas = this.getCitas();
    citas.push(cita);
    this.saveCitas(citas);
  }

  updateCitaEstado(citaId: string, estado: EstadoCita): void {
    const citas = this.getCitas();
    const cita = citas.find(c => c.id === citaId);
    if (cita) {
      cita.estado = estado;
      this.saveCitas(citas);
    }
  }

  deleteCita(citaId: string): void {
    const citas = this.getCitas().filter(c => c.id !== citaId);
    this.saveCitas(citas);
  }

  private saveCitas(citas: Cita[]): void {
    localStorage.setItem(this.STORAGE_CITAS, JSON.stringify(citas));
  }

  // --- HISTORIAL CLÍNICO ---
  getHistorialCompleto(): RegistroClinico[] {
    const raw = localStorage.getItem(this.STORAGE_HISTORIAL);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map(item => {
      if (item.tipo === 'vacuna') {
        return new RegistroVacuna(
          item.id,
          item.mascotaId,
          item.fecha,
          item.veterinario,
          item.diagnostico,
          item.nombreVacuna,
          item.lote,
          item.proximaDosis
        );
      } else if (item.tipo === 'tratamiento') {
        return new RegistroTratamiento(
          item.id,
          item.mascotaId,
          item.fecha,
          item.veterinario,
          item.diagnostico,
          item.medicacion,
          item.dosis,
          item.duracionDias
        );
      } else {
        return new RegistroCirugia(
          item.id,
          item.mascotaId,
          item.fecha,
          item.veterinario,
          item.diagnostico,
          item.procedimiento,
          item.tipoAnestesia,
          item.cuidadosPostoperatorios
        );
      }
    });
  }

  getHistorialByMascota(mascotaId: string): RegistroClinico[] {
    return this.getHistorialCompleto().filter(h => h.mascotaId === mascotaId);
  }

  addRegistroClinico(registro: RegistroClinico): void {
    const historial = this.getHistorialCompleto();
    historial.push(registro);
    this.saveHistorial(historial);
  }

  private saveHistorial(historial: RegistroClinico[]): void {
    localStorage.setItem(this.STORAGE_HISTORIAL, JSON.stringify(historial));
  }

  // --- INICIALIZACIÓN ---
  private inicializarDatosSemilla(): void {
    if (localStorage.getItem(this.STORAGE_DUENOS)) {
      // Ya existen datos en localstorage, no sobreescribir
      return;
    }

    // Dueños de prueba
    const d1 = new Dueno('d1', 'Juan Pérez', '998877665', 'juan.perez@email.com', 'Av. Larco 123, Miraflores');
    const d2 = new Dueno('d2', 'María Gómez', '987654321', 'maria.gomez@email.com', 'Calle Las Flores 456, San Isidro');
    const d3 = new Dueno('d3', 'Carlos Mendoza', '912345678', 'carlos.mendoza@email.com', 'Av. La Marina 789, San Miguel');

    // Mascotas de prueba
    const m1 = new Mascota('m1', 'Toby', 'Perro', 'Golden Retriever', 3, 25.5, 'd1');
    const m2 = new Mascota('m2', 'Michi', 'Gato', 'Siamés', 2, 4.2, 'd1');
    const m3 = new Mascota('m3', 'Luna', 'Gato', 'Angora', 1, 3.8, 'd2');
    const m4 = new Mascota('m4', 'Zeus', 'Perro', 'Pastor Alemán', 5, 32.0, 'd3');

    d1.mascotasIds = ['m1', 'm2'];
    d2.mascotasIds = ['m3'];
    d3.mascotasIds = ['m4'];

    // Citas de prueba
    // Para la directiva appResaltarProxima, necesitamos citas que ocurran hoy o mañana
    const hoyStr = new Date().toISOString().split('T')[0];
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const mananaStr = manana.toISOString().split('T')[0];

    const c1 = new Cita('c1', 'd1', 'm1', hoyStr, '10:30', 'Consulta médica general por estornudos', 'pendiente');
    const c2 = new Cita('c2', 'd1', 'm2', mananaStr, '15:00', 'Vacunación Triple Felina de refuerzo', 'confirmada');
    const c3 = new Cita('c2', 'd2', 'm3', '2026-07-15', '09:00', 'Baño y corte de pelo', 'confirmada');
    const c4 = new Cita('c4', 'd3', 'm4', '2026-07-02', '16:00', 'Esterilización programada', 'completada');

    // Historial clínico de prueba
    const h1 = new RegistroVacuna(
      'h1',
      'm1',
      '2026-05-10',
      'Ana Torres',
      'Paciente sano apto para vacunar',
      'Vacuna Quíntuple',
      'Q-88921',
      '2027-05-10'
    );

    const h2 = new RegistroTratamiento(
      'h2',
      'm1',
      '2026-06-15',
      'Daniel Rivas',
      'Otitis externa bilateral por ácaros',
      'Gotas óticas Oticum',
      '3 gotas en cada oído cada 12 horas',
      7
    );

    const h3 = new RegistroCirugia(
      'h3',
      'm4',
      '2026-07-02',
      'René Flores',
      'Criptorquidia unilateral detectada en consulta',
      'Orquiectomía bilateral preventiva',
      'Inhalatoria e Intravenosa',
      'Limpieza diaria de herida, reposo absoluto, uso de collar isabelino por 10 días'
    );

    const h4 = new RegistroVacuna(
      'h4',
      'm3',
      '2026-04-20',
      'Ana Torres',
      'Vacunación anual',
      'Triple Felina',
      'TF-77211',
      '2027-04-20'
    );

    localStorage.setItem(this.STORAGE_DUENOS, JSON.stringify([d1, d2, d3]));
    localStorage.setItem(this.STORAGE_MASCOTAS, JSON.stringify([m1, m2, m3, m4]));
    localStorage.setItem(this.STORAGE_CITAS, JSON.stringify([c1, c2, c3, c4]));
    localStorage.setItem(this.STORAGE_HISTORIAL, JSON.stringify([h1, h2, h3, h4]));
  }
}
