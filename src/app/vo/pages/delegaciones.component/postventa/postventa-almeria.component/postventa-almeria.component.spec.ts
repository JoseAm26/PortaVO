import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaAlmeriaComponent } from './postventa-almeria.component';

describe('PostventaAlmeriaComponent', () => {
  let component: PostventaAlmeriaComponent;
  let fixture: ComponentFixture<PostventaAlmeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaAlmeriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaAlmeriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
