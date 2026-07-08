import { Pipe, PipeTransform } from '@angular/core';
import { EstadoCita } from '../../core/models/cita.model';

@Pipe({
  name: 'estadoCita',
  standalone: true
})
export class EstadoCitaPipe implements PipeTransform {
  transform(value: EstadoCita | string): string {
    switch (value) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmada':
        return 'Confirmada';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return value;
    }
  }
}
