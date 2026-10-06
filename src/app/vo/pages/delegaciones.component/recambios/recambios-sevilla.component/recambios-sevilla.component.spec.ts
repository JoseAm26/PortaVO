import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosSevillaComponent } from './recambios-sevilla.component';

describe('RecambiosSevillaComponent', () => {
  let component: RecambiosSevillaComponent;
  let fixture: ComponentFixture<RecambiosSevillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosSevillaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosSevillaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
