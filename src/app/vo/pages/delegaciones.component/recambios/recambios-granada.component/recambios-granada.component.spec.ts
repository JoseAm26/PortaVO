import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosGranadaComponent } from './recambios-granada.component';

describe('RecambiosGranadaComponent', () => {
  let component: RecambiosGranadaComponent;
  let fixture: ComponentFixture<RecambiosGranadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosGranadaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosGranadaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
