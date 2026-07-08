export abstract class Persona {
  constructor(
    public id: string,
    public nombre: string,
    public telefono: string,
    public email: string
  ) {}

  abstract obtenerInformacionContacto(): string;
}
