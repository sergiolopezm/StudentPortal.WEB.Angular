import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EstudianteService } from '../../../core/services/estudiante.service';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';
import { NavigationButtonsComponent } from '../../../shared/components/navigation-buttons/navigation-buttons.component'; // 1. IMPORTA EL COMPONENTE (ajusta la ruta si es necesario)

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavigationButtonsComponent // 2. AÑADE EL COMPONENTE AQUÍ
  ],
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {
  dataSource = { data: [] as EstudianteDto[] };
  allEstudiantes: EstudianteDto[] = [];
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
          this.allEstudiantes = response.resultado || [];
          this.dataSource.data = this.allEstudiantes;
        }
      },
      error: (error) => console.error('Error loading students:', error),
      complete: () => this.loading = false
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.dataSource.data = this.allEstudiantes;
      return;
    }

    const filterValue = this.searchTerm.toLowerCase();
    this.dataSource.data = this.allEstudiantes.filter(estudiante => 
      estudiante.nombreCompleto?.toLowerCase().includes(filterValue) ||
      estudiante.identificacion?.toLowerCase().includes(filterValue) ||
      estudiante.email?.toLowerCase().includes(filterValue) ||
      estudiante.programa?.toLowerCase().includes(filterValue)
    );
  }

  verDetalle(id: number): void {
    window.location.href = `/estudiantes/${id}`;
  }

  editarEstudiante(id: number): void {
    window.location.href = `/estudiantes/editar/${id}`;
  }

  toggleEstudianteActivo(estudiante: EstudianteDto): void {
    if (confirm(`¿Está seguro que desea ${estudiante.activo ? 'desactivar' : 'activar'} al estudiante ${estudiante.nombreCompleto}?`)) {
      estudiante.activo = !estudiante.activo;
      
      this.estudianteService.update(estudiante.id, estudiante).subscribe({
        next: (response) => {
          if (response.exito) {
            alert(`Estudiante ${estudiante.activo ? 'activado' : 'desactivado'} correctamente`);
            this.loadEstudiantes();
          } else {
            alert('Error al actualizar estudiante: ' + response.mensaje);
            estudiante.activo = !estudiante.activo;
          }
        },
        error: (error) => {
          alert('Error al actualizar estudiante');
          estudiante.activo = !estudiante.activo;
        }
      });
    }
  }
}