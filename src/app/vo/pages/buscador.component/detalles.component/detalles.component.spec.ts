import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesComponent } from './detalles.component';

describe('DetallesComponent', () => {
  let component: DetallesComponent;
  let fixture: ComponentFixture<DetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
