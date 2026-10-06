import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaRedesSocialesComponent } from './politica-redes-sociales.component';

describe('PoliticaRedesSocialesComponent', () => {
  let component: PoliticaRedesSocialesComponent;
  let fixture: ComponentFixture<PoliticaRedesSocialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaRedesSocialesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaRedesSocialesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
