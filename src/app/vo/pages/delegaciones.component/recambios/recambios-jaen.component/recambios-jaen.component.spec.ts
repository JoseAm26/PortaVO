import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosJaenComponent } from './recambios-jaen.component';

describe('RecambiosJaenComponent', () => {
  let component: RecambiosJaenComponent;
  let fixture: ComponentFixture<RecambiosJaenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosJaenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosJaenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
