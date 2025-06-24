export interface EstudianteDto {
    id: number;
    usuarioId: string;
    identificacion: string;
    telefono?: string;
    carrera?: string;
    programaId: number;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    
    // Propiedades de navegación para UI
    nombreCompleto?: string;
    email?: string;
    programa?: string;
    materiasInscritasCount: number;
    creditosActuales: number;
  }