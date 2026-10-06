import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarComponent } from './activar.component';

describe('ActivarComponent', () => {
  let component: ActivarComponent;
  let fixture: ComponentFixture<ActivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
