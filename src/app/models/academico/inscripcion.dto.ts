export interface InscripcionDto {
    id: number;
    estudianteId: number;
    materiaId: number;
    fechaInscripcion: Date;
    estado: string;
    calificacion?: number;
    fechaModificacion?: Date;
    activo: boolean;
    
    // Propiedades de navegación para UI
    estudianteNombre?: string;
    materiaCodigoyNombre?: string;
    credMateria: number;
    profesores?: string[];
  }