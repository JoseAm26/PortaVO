import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuarlioDetalleComponent } from './formuarlio-detalle.component';

describe('FormuarlioDetalleComponent', () => {
  let component: FormuarlioDetalleComponent;
  let fixture: ComponentFixture<FormuarlioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormuarlioDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormuarlioDetalleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
