import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEspecificoComponent } from './detalle-especifico.component';

describe('DetalleEspecificoComponent', () => {
  let component: DetalleEspecificoComponent;
  let fixture: ComponentFixture<DetalleEspecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEspecificoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleEspecificoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
