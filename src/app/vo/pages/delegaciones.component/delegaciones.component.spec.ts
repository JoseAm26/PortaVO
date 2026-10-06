import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegacionesComponent } from './delegaciones.component';

describe('DelegacionesComponent', () => {
  let component: DelegacionesComponent;
  let fixture: ComponentFixture<DelegacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegacionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegacionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
