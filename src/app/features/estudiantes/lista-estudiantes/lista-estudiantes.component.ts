import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EstudianteService } from '../../../core/services/estudiante.service';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['identificacion', 'nombre', 'email', 'programa', 'materias', 'creditos', 'acciones'];
  dataSource = new MatTableDataSource<EstudianteDto>();
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
        if (response.success) {
          this.dataSource.data = response.data || [];
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => console.error('Error loading students:', error),
      complete: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  verDetalle(id: number): void {
    // Navegar al detalle del estudiante
  }

  editarEstudiante(id: number): void {
    // Navegar al formulario de edición
  }
}