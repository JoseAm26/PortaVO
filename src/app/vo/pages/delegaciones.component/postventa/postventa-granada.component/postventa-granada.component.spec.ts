import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaGranadaComponent } from './postventa-granada.component';

describe('PostventaGranadaComponent', () => {
  let component: PostventaGranadaComponent;
  let fixture: ComponentFixture<PostventaGranadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaGranadaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaGranadaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
