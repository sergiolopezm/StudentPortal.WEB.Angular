import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { ProgramaService } from '../../../core/services/programa.service';
import { UsuarioRegistroCompletoDto } from '../../../models/auth/usuario-registro-completo.dto';
import { ProgramaDto } from '../../../models/academico/programa.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  programas: ProgramaDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private programaService: ProgramaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rolId: [2, [Validators.required]], // 2 = Estudiante por defecto
      identificacion: ['', [Validators.required]],
      telefono: [''],
      carrera: [''],
      programaId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProgramas();
  }

  private loadProgramas(): void {
    this.programaService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.programas = response.data || [];
        }
      },
      error: (error) => console.error('Error loading programs:', error)
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const registerData: UsuarioRegistroCompletoDto = {
        nombreUsuario: this.registerForm.value.nombreUsuario,
        contraseña: this.registerForm.value.contraseña,
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellido,
        email: this.registerForm.value.email,
        rolId: this.registerForm.value.rolId,
        estudianteInfo: {
          id: 0,
          usuarioId: '',
          identificacion: this.registerForm.value.identificacion,
          telefono: this.registerForm.value.telefono,
          carrera: this.registerForm.value.carrera,
          programaId: this.registerForm.value.programaId,
          activo: true,
          fechaCreacion: new Date(),
          materiasInscritasCount: 0,
          creditosActuales: 0
        }
      };

      this.authService.registerComplete(registerData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open(response.message, 'Cerrar', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 5000 });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}