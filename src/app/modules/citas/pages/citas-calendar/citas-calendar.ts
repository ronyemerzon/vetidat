import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VetDataService } from '../../../../core/services/vet-data.service';
import { Cita, EstadoCita } from '../../../../core/models/cita.model';
import { Mascota } from '../../../../core/models/mascota.model';
import { Dueno } from '../../../../core/models/dueno.model';
import { EstadoCitaPipe } from '../../../../shared/pipes/estado-cita.pipe';
import { FechaAmigablePipe } from '../../../../shared/pipes/fecha-amigable.pipe';
import { ResaltarProximaDirective } from '../../../../shared/directives/resaltar-proxima.directive';
import { ModalAgenda } from '../../../../shared/components/modal-agenda/modal-agenda';

@Component({
  selector: 'app-citas-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    EstadoCitaPipe, 
    FechaAmigablePipe, 
    ResaltarProximaDirective, 
    ModalAgenda
  ],
  templateUrl: './citas-calendar.html',
  styleUrl: './citas-calendar.scss'
})
export class CitasCalendar implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  
  filtroEstado: string = 'todas';
  busqueda: string = '';
  
  isModalOpen: boolean = false;

  constructor(private vetService: VetDataService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    // Cargar citas y ordenarlas por fecha y hora
    const rawCitas = this.vetService.getCitas();
    this.citas = rawCitas.sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`);
      const dateB = new Date(`${b.fecha}T${b.hora}`);
      return dateA.getTime() - dateB.getTime();
    });
    this.filtrarCitas();
  }

  filtrarCitas(): void {
    let result = this.citas;

    // Filtrar por estado
    if (this.filtroEstado !== 'todas') {
      result = result.filter(c => c.estado === this.filtroEstado);
    }

    // Filtrar por búsqueda de texto (mascota o dueño)
    const query = this.busqueda.toLowerCase().trim();
    if (query) {
      result = result.filter(c => {
        const pet = this.getMascota(c.mascotaId);
        const owner = this.getDueno(c.duenoId);
        return (pet && pet.nombre.toLowerCase().includes(query)) ||
               (owner && owner.nombre.toLowerCase().includes(query)) ||
               c.motivo.toLowerCase().includes(query);
      });
    }

    this.citasFiltradas = result;
  }

  getMascota(id: string): Mascota | undefined {
    return this.vetService.getMascotas().find(m => m.id === id);
  }

  getDueno(id: string): Dueno | undefined {
    return this.vetService.getDuenoById(id);
  }

  cambiarEstado(citaId: string, nuevoEstado: EstadoCita): void {
    this.vetService.updateCitaEstado(citaId, nuevoEstado);
    this.cargarCitas();
  }

  eliminarCita(citaId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita del sistema?')) {
      this.vetService.deleteCita(citaId);
      this.cargarCitas();
    }
  }

  obtenerClaseBadge(estado: EstadoCita): string {
    switch (estado) {
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'confirmada':
        return 'bg-primary';
      case 'completada':
        return 'bg-success';
      case 'cancelada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }
}
