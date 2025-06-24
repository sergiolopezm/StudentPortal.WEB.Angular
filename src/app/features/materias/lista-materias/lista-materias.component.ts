import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MateriaService } from '../../../core/services/materia.service';
import { MateriaDto } from '../../../models/academico/materia.dto';

@Component({
  selector: 'app-lista-materias',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.css']
})
export class ListaMateriasComponent implements OnInit {
  materias: MateriaDto[] = [];
  loading = true;
  displayedColumns: string[] = ['codigo', 'nombre', 'creditos', 'profesores', 'inscripciones'];

  constructor(private materiaService: MateriaService) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.materiaService.getAll().subscribe({
      next: (response) => {
        if (response.exito) {
          this.materias = response.resultado || [];
        }
      },
      error: (error) => console.error('Error loading materias:', error),
      complete: () => this.loading = false
    });
  }
}