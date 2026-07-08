import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appResaltarProxima]',
  standalone: true
})
export class ResaltarProximaDirective implements OnInit, OnChanges {
  @Input('appResaltarProxima') fechaCita!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.evaluarYAplicarResaltado();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fechaCita']) {
      this.evaluarYAplicarResaltado();
    }
  }

  private evaluarYAplicarResaltado(): void {
    if (!this.fechaCita) return;

    try {
      const parts = this.fechaCita.split('-');
      if (parts.length !== 3) return;

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const dateCita = new Date(year, month, day);

      const now = new Date();
      const dateHoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const dateManana = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      // Limpiar estilos previos por si cambia la fecha
      this.renderer.removeStyle(this.el.nativeElement, 'border-left');
      this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
      this.renderer.removeClass(this.el.nativeElement, 'bg-warning-subtle');

      if (dateCita.getTime() === dateHoy.getTime()) {
        // Cita para HOY - Resaltado fuerte (borde rojo/naranja y sombra)
        this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #dc3545'); // danger
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 10px rgba(220, 53, 69, 0.2)');
        this.renderer.addClass(this.el.nativeElement, 'bg-warning-subtle'); // fondo amarillo suave
      } else if (dateCita.getTime() === dateManana.getTime()) {
        // Cita para MAÑANA - Resaltado moderado (borde amarillo/naranja y sombra suave)
        this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #ff9100'); // accent
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 8px rgba(255, 145, 0, 0.15)');
        this.renderer.addClass(this.el.nativeElement, 'bg-warning-subtle');
      }
    } catch (e) {
      // Ignorar errores de parseo
    }
  }
}
