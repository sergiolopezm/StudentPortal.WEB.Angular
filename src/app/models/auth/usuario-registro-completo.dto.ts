import { EstudianteDto } from '../academico/estudiante.dto';
import { ProfesorDto } from '../academico/profesor.dto';

export interface UsuarioRegistroCompletoDto {
  nombreUsuario: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  estudianteInfo?: EstudianteDto;
  profesorInfo?: ProfesorDto;
}