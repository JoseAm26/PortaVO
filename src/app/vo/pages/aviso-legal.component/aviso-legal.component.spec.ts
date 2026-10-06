import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoLegalComponent } from './aviso-legal.component';

describe('AvisoLegalComponent', () => {
  let component: AvisoLegalComponent;
  let fixture: ComponentFixture<AvisoLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoLegalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoLegalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
