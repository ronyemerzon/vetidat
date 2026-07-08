import { Persona } from './persona.model';

export class Dueno extends Persona {
  public mascotasIds: string[] = [];

  constructor(
    id: string,
    nombre: string,
    telefono: string,
    email: string,
    public direccion: string
  ) {
    super(id, nombre, telefono, email);
  }

  obtenerInformacionContacto(): string {
    return `${this.nombre} - Teléf: ${this.telefono} | Dir: ${this.direccion}`;
  }
}
