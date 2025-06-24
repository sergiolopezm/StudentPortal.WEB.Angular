export interface ProfesorDto {
    id: number;
    usuarioId: string;
    identificacion: string;
    telefono?: string;
    departamento?: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    
    // Propiedades de navegación para UI
    nombreCompleto?: string;
    email?: string;
    materias?: string[];
    materiasCount: number;
  }