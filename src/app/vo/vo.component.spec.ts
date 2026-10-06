import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VOComponent } from './vo.component';

describe('VOComponent', () => {
  let component: VOComponent;
  let fixture: ComponentFixture<VOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VOComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VOComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
