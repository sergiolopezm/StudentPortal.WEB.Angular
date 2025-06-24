import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="alert-banner" [ngClass]="type">
      <mat-icon>{{getIcon()}}</mat-icon>
      <div class="alert-content">
        <p class="alert-message">{{message}}</p>
      </div>
      <button mat-icon-button *ngIf="dismissible" (click)="onDismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .alert-banner {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 16px 0;
      color: white;
    }
    
    .alert-banner.info {
      background-color: #2196f3;
    }
    
    .alert-banner.success {
      background-color: #4caf50;
    }
    
    .alert-banner.warning {
      background-color: #ff9800;
    }
    
    .alert-banner.error {
      background-color: #f44336;
    }
    
    .alert-content {
      flex: 1;
      margin: 0 16px;
    }
    
    .alert-message {
      margin: 0;
    }
  `]
})
export class AlertBannerComponent {
  @Input() message: string = '';
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() dismissible: boolean = false;
  
  getIcon(): string {
    switch(this.type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }
  
  onDismiss(): void {
    const element = document.querySelector('.alert-banner');
    if (element) {
      element.remove();
    }
  }
}