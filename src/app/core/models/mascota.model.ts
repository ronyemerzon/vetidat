export class Mascota {
  constructor(
    public id: string,
    public nombre: string,
    public especie: string, // Perro, Gato, Ave, etc.
    public raza: string,
    public edad: number, // en años
    public peso: number, // en kg
    public duenoId: string
  ) {}

  obtenerDetalleCompleto(): string {
    return `${this.nombre} (${this.especie} - ${this.raza}, ${this.edad} años, ${this.peso} kg)`;
  }
}
