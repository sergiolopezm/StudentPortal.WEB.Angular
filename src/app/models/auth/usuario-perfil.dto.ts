export interface UsuarioPerfilDto {
    id: string;
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    nombreCompleto?: string;
  }