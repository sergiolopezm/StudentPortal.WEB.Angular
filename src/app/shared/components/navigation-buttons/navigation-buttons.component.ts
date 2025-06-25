import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex mt-2 mb-3">
      <button *ngIf="showBack" class="btn btn-outline-secondary me-2" (click)="goBack()">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
      <a *ngIf="showHome" href="/dashboard" class="btn btn-outline-primary">
        <i class="bi bi-house-door"></i> Panel Principal
      </a>
    </div>
  `
})
export class NavigationButtonsComponent {
  @Input() showBack: boolean = true;
  @Input() showHome: boolean = true;

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}