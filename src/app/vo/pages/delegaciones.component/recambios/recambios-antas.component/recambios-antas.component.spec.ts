import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosAntasComponent } from './recambios-antas.component';

describe('RecambiosAntasComponent', () => {
  let component: RecambiosAntasComponent;
  let fixture: ComponentFixture<RecambiosAntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosAntasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosAntasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
