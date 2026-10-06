import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestacadasComponent } from './destacadas.component';

describe('DestacadasComponent', () => {
  let component: DestacadasComponent;
  let fixture: ComponentFixture<DestacadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestacadasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DestacadasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
