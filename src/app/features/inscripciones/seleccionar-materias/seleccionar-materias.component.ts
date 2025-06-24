import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MateriaService } from '../../../core/services/materia.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';
import { MateriaDto } from '../../../models/academico/materia.dto';
import { InscripcionDto } from '../../../models/academico/inscripcion.dto';

@Component({
  selector: 'app-seleccionar-materias',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './seleccionar-materias.component.html',
  styleUrls: ['./seleccionar-materias.component.css']
})
export class SeleccionarMateriasComponent implements OnInit {
  estudiante: EstudianteDto | null = null;
  materias: MateriaDto[] = [];
  materiasInscritas: number[] = [];
  loading = true;
  inscribiendo = false;
  displayedColumns: string[] = ['codigo', 'nombre', 'creditos', 'profesores', 'accion'];

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      await this.loadEstudianteData();
      await this.loadMaterias();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadEstudianteData(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const estudiantesResult = await this.estudianteService.getAll().toPromise();
    if (estudiantesResult?.success) {
      this.estudiante = estudiantesResult.data?.find(e => e.usuarioId === currentUser.id) || null;
      
      if (this.estudiante) {
        const inscripcionesResult = await this.inscripcionService.getByEstudiante(this.estudiante.id).toPromise();
        if (inscripcionesResult?.success) {
          this.materiasInscritas = inscripcionesResult.data?.map(i => i.materiaId) || [];
        }
      }
    }
  }

  private async loadMaterias(): Promise<void> {
    const materiasResult = await this.materiaService.getAll().toPromise();
    if (materiasResult?.success) {
      this.materias = materiasResult.data || [];
    }
  }

  async inscribirMateria(materiaId: number): Promise<void> {
    if (!this.estudiante) return;

    this.inscribiendo = true;
    
    const inscripcion: InscripcionDto = {
      id: 0,
      estudianteId: this.estudiante.id,
      materiaId: materiaId,
      fechaInscripcion: new Date(),
      estado: 'Inscrito',
      activo: true,
      credMateria: 0
    };

    this.inscripcionService.inscribir(inscripcion).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Materia inscrita correctamente', 'Cerrar', { duration: 3000 });
          this.materiasInscritas.push(materiaId);
          this.loadEstudianteData();
        } else {
          this.snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al inscribir materia', 'Cerrar', { duration: 5000 });
      },
      complete: () => {
        this.inscribiendo = false;
      }
    });
  }

  get materiasDisponibles(): MateriaDto[] {
    return this.materias.filter(m => !this.materiasInscritas.includes(m.id));
  }
}