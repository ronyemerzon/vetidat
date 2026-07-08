export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export class Cita {
  constructor(
    public id: string,
    public duenoId: string,
    public mascotaId: string,
    public fecha: string, // YYYY-MM-DD
    public hora: string,  // HH:MM
    public motivo: string,
    public estado: EstadoCita = 'pendiente'
  ) {}
}
