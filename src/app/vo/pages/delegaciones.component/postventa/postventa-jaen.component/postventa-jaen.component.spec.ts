import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaJaenComponent } from './postventa-jaen.component';

describe('PostventaJaenComponent', () => {
  let component: PostventaJaenComponent;
  let fixture: ComponentFixture<PostventaJaenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaJaenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaJaenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
