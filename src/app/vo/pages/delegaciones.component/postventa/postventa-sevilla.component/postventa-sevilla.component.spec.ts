import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaSevillaComponent } from './postventa-sevilla.component';

describe('PostventaSevillaComponent', () => {
  let component: PostventaSevillaComponent;
  let fixture: ComponentFixture<PostventaSevillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaSevillaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaSevillaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
