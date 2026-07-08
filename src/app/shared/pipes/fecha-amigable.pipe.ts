import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaAmigable',
  standalone: true
})
export class FechaAmigablePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    try {
      const parts = value.split('-');
      if (parts.length !== 3) return value;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const date = new Date(year, month, day);
      
      // Formatear en español, p.ej. "miércoles, 8 de julio de 2026"
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      let formatted = date.toLocaleDateString('es-ES', options);
      // Capitalizar la primera letra
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return value;
    }
  }
}
