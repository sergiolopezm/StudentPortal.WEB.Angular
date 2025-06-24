import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { ProgramaDto } from '../../models/academico/programa.dto';
import { PaginacionDto } from '../../models/common/paginacion.dto';
import { ResponseDto } from '../../models/common/response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private apiUrl = `${environment.apiUrl}/Programas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<ProgramaDto[]>> {
    return this.http.get<ResponseDto<ProgramaDto[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ResponseDto<ProgramaDto>> {
    return this.http.get<ResponseDto<ProgramaDto>>(`${this.apiUrl}/${id}`);
  }

  getPaginated(page: number, itemsPerPage: number, search?: string): Observable<ResponseDto<PaginacionDto<ProgramaDto>>> {
    let params = `page=${page}&itemsPerPage=${itemsPerPage}`;
    if (search) params += `&search=${search}`;
    return this.http.get<ResponseDto<PaginacionDto<ProgramaDto>>>(`${this.apiUrl}/paginated?${params}`);
  }
}