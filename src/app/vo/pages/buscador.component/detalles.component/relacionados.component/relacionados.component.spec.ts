import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionadosComponent } from './relacionados.component';

describe('RelacionadosComponent', () => {
  let component: RelacionadosComponent;
  let fixture: ComponentFixture<RelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelacionadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelacionadosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
