import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaCookiesComponent } from './politica-cookies.component';

describe('PoliticaCookiesComponent', () => {
  let component: PoliticaCookiesComponent;
  let fixture: ComponentFixture<PoliticaCookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaCookiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaCookiesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
