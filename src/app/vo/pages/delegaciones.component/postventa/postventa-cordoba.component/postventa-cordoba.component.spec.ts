import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaCordobaComponent } from './postventa-cordoba.component';

describe('PostventaCordobaComponent', () => {
  let component: PostventaCordobaComponent;
  let fixture: ComponentFixture<PostventaCordobaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaCordobaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaCordobaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
