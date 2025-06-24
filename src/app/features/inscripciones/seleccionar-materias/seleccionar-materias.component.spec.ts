import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarMateriasComponent } from './seleccionar-materias.component';

describe('SeleccionarMateriasComponent', () => {
  let component: SeleccionarMateriasComponent;
  let fixture: ComponentFixture<SeleccionarMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
