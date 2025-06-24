import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { InscripcionDto } from '../../models/academico/inscripcion.dto';
import { PaginacionDto } from '../../models/common/paginacion.dto';
import { ResponseDto } from '../../models/common/response.dto';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = `${environment.apiUrl}/InscripcionEstudiante`;

  constructor(private http: HttpClient) {}

  getByEstudiante(estudianteId: number): Observable<ResponseDto<InscripcionDto[]>> {
    return this.http.get<ResponseDto<InscripcionDto[]>>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }

  getByMateria(materiaId: number): Observable<ResponseDto<InscripcionDto[]>> {
    return this.http.get<ResponseDto<InscripcionDto[]>>(`${this.apiUrl}/materia/${materiaId}`);
  }

  getById(id: number): Observable<ResponseDto<InscripcionDto>> {
    return this.http.get<ResponseDto<InscripcionDto>>(`${this.apiUrl}/${id}`);
  }

  getPaginated(page: number, itemsPerPage: number, estudianteId?: number, materiaId?: number): Observable<ResponseDto<PaginacionDto<InscripcionDto>>> {
    let params = `page=${page}&itemsPerPage=${itemsPerPage}`;
    if (estudianteId) params += `&estudianteId=${estudianteId}`;
    if (materiaId) params += `&materiaId=${materiaId}`;
    return this.http.get<ResponseDto<PaginacionDto<InscripcionDto>>>(`${this.apiUrl}/paginated?${params}`);
  }

  inscribir(inscripcion: InscripcionDto): Observable<ResponseDto<InscripcionDto>> {
    return this.http.post<ResponseDto<InscripcionDto>>(`${this.apiUrl}`, inscripcion);
  }

  calificar(id: number, calificacion: number): Observable<ResponseDto<InscripcionDto>> {
    return this.http.put<ResponseDto<InscripcionDto>>(`${this.apiUrl}/${id}/calificar`, { calificacion });
  }

  cancelar(id: number): Observable<ResponseDto<InscripcionDto>> {
    return this.http.put<ResponseDto<InscripcionDto>>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}