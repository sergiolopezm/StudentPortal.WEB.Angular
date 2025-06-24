export interface ProgramaDto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion?: Date;
    
    // Propiedades de navegación para UI
    estudiantesCount: number;
    materiasCount: number;
  }