import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MateriaService } from '../../../core/services/materia.service';
import { MateriaDto } from '../../../models/academico/materia.dto';

@Component({
  selector: 'app-lista-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.css']
})
export class ListaMateriasComponent implements OnInit {
  materias: MateriaDto[] = [];
  loading = true;
  searchTerm = '';

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

  SearchMaterias(): void {
    // Implementar filtro si es necesario
  }

  // lista-materias.component.ts
  truncar(descr = '', max = 50, tail = '...'): string {
    if (descr.length <= max) return descr;
    // ojo con caracteres multi-byte: usar Intl.Segmenter si te importa
    return descr.substring(0, max - tail.length) + tail;
  }
}