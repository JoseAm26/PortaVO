import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosMalagaComponent } from './recambios-malaga.component';

describe('RecambiosMalagaComponent', () => {
  let component: RecambiosMalagaComponent;
  let fixture: ComponentFixture<RecambiosMalagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosMalagaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosMalagaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
