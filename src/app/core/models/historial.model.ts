export abstract class RegistroClinico {
  abstract readonly tipo: 'vacuna' | 'tratamiento' | 'cirugia';

  constructor(
    public id: string,
    public mascotaId: string,
    public fecha: string, // YYYY-MM-DD
    public veterinario: string,
    public diagnostico: string
  ) {}

  abstract generarResumenDetallado(): string;
}

export class RegistroVacuna extends RegistroClinico {
  readonly tipo = 'vacuna';

  constructor(
    id: string,
    mascotaId: string,
    fecha: string,
    veterinario: string,
    diagnostico: string,
    public nombreVacuna: string,
    public lote: string,
    public proximaDosis: string // YYYY-MM-DD
  ) {
    super(id, mascotaId, fecha, veterinario, diagnostico);
  }

  generarResumenDetallado(): string {
    return `Inmunización con vacuna ${this.nombreVacuna} (Lote: ${this.lote}). Diagnóstico general: ${this.diagnostico}. Próxima dosis recomendada el ${this.proximaDosis}. Atendido por Dr(a). ${this.veterinario}.`;
  }
}

export class RegistroTratamiento extends RegistroClinico {
  readonly tipo = 'tratamiento';

  constructor(
    id: string,
    mascotaId: string,
    fecha: string,
    veterinario: string,
    diagnostico: string,
    public medicacion: string,
    public dosis: string,
    public duracionDias: number
  ) {
    super(id, mascotaId, fecha, veterinario, diagnostico);
  }

  generarResumenDetallado(): string {
    return `Tratamiento recetado para: ${this.diagnostico}. Medicación: ${this.medicacion} con dosis de ${this.dosis} por un período de ${this.duracionDias} días. Atendido por Dr(a). ${this.veterinario}.`;
  }
}

export class RegistroCirugia extends RegistroClinico {
  readonly tipo = 'cirugia';

  constructor(
    id: string,
    mascotaId: string,
    fecha: string,
    veterinario: string,
    diagnostico: string,
    public procedimiento: string,
    public tipoAnestesia: string,
    public cuidadosPostoperatorios: string
  ) {
    super(id, mascotaId, fecha, veterinario, diagnostico);
  }

  generarResumenDetallado(): string {
    return `Procedimiento quirúrgico realizado: ${this.procedimiento} bajo anestesia ${this.tipoAnestesia}. Diagnóstico/Indicación: ${this.diagnostico}. Cuidados sugeridos: ${this.cuidadosPostoperatorios}. Atendido por Dr(a). ${this.veterinario}.`;
  }
}
