export interface ResponseDto<T> {
  exito: boolean;
  mensaje: string;
  resultado?: T;
  detalle?: string;
}