import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedasComponent } from './busquedas.component';

describe('BusquedasComponent', () => {
  let component: BusquedasComponent;
  let fixture: ComponentFixture<BusquedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
