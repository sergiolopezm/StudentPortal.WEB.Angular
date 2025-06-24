import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { MateriaDto } from '../../models/academico/materia.dto';
import { PaginacionDto } from '../../models/common/paginacion.dto';
import { ResponseDto } from '../../models/common/response.dto';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = `${environment.apiUrl}/Materias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<MateriaDto[]>> {
    return this.http.get<ResponseDto<MateriaDto[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ResponseDto<MateriaDto>> {
    return this.http.get<ResponseDto<MateriaDto>>(`${this.apiUrl}/${id}`);
  }

  getPaginated(page: number, itemsPerPage: number, search?: string): Observable<ResponseDto<PaginacionDto<MateriaDto>>> {
    let params = `page=${page}&itemsPerPage=${itemsPerPage}`;
    if (search) params += `&search=${search}`;
    return this.http.get<ResponseDto<PaginacionDto<MateriaDto>>>(`${this.apiUrl}/paginated?${params}`);
  }
}