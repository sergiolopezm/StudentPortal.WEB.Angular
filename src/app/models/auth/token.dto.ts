import { UsuarioPerfilDto } from './usuario-perfil.dto';

export interface TokenDto {
  token: string;
  expiracion: Date;
  usuario: UsuarioPerfilDto;
}