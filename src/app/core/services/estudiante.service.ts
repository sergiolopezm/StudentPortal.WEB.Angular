import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development'

import { EstudianteDto } from '../../models/academico/estudiante.dto';
import { CompaneroClaseDto } from '../../models/academico/companero-clase.dto';
import { PaginacionDto } from '../../models/common/paginacion.dto';
import { ResponseDto } from '../../models/common/response.dto';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/Estudiante`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<EstudianteDto[]>> {
    return this.http.get<ResponseDto<EstudianteDto[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ResponseDto<EstudianteDto>> {
    return this.http.get<ResponseDto<EstudianteDto>>(`${this.apiUrl}/${id}`);
  }

  getPaginated(page: number, itemsPerPage: number, search?: string): Observable<ResponseDto<PaginacionDto<EstudianteDto>>> {
    let params = `page=${page}&itemsPerPage=${itemsPerPage}`;
    if (search) params += `&search=${search}`;
    return this.http.get<ResponseDto<PaginacionDto<EstudianteDto>>>(`${this.apiUrl}/paginated?${params}`);
  }

  create(estudiante: EstudianteDto): Observable<ResponseDto<EstudianteDto>> {
    return this.http.post<ResponseDto<EstudianteDto>>(this.apiUrl, estudiante);
  }

  update(id: number, estudiante: EstudianteDto): Observable<ResponseDto<EstudianteDto>> {
    return this.http.put<ResponseDto<EstudianteDto>>(`${this.apiUrl}/${id}`, estudiante);
  }

  delete(id: number): Observable<ResponseDto<any>> {
    return this.http.delete<ResponseDto<any>>(`${this.apiUrl}/${id}`);
  }

  getCompaneros(id: number): Observable<ResponseDto<CompaneroClaseDto[]>> {
    return this.http.get<ResponseDto<CompaneroClaseDto[]>>(`${this.apiUrl}/${id}/companeros`);
  }
}