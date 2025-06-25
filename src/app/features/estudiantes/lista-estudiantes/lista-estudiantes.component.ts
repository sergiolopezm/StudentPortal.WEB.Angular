import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EstudianteService } from '../../../core/services/estudiante.service';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {
  dataSource = { data: [] as EstudianteDto[] };
  loading = true;
  searchTerm = '';

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.loading = true;
    this.estudianteService.getAll().subscribe({
      next: (response) => {
        if (response.exito) {
          this.dataSource.data = response.resultado || [];
        }
      },
      error: (error) => console.error('Error loading students:', error),
      complete: () => this.loading = false
    });
  }

  applyFilter(): void {
    // Implementar filtro si es necesario
  }

  verDetalle(id: number): void {
    // Navegar al detalle del estudiante
  }

  editarEstudiante(id: number): void {
    // Navegar al formulario de edición
  }
}