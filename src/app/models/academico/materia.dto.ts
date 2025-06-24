export interface MateriaDto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    creditos: number;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    creadoPorId?: string;
    modificadoPorId?: string;
    
    // Propiedades de navegación para UI
    creadoPor?: string;
    modificadoPor?: string;
    inscripcionesCount: number;
    profesores?: string[];
  }