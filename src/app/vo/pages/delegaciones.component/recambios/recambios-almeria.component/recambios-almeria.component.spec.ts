import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosAlmeriaComponent } from './recambios-almeria.component';

describe('RecambiosAlmeriaComponent', () => {
  let component: RecambiosAlmeriaComponent;
  let fixture: ComponentFixture<RecambiosAlmeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosAlmeriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosAlmeriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
