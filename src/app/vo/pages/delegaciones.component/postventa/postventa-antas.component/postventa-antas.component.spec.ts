import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaAntasComponent } from './postventa-antas.component';

describe('PostventaAntasComponent', () => {
  let component: PostventaAntasComponent;
  let fixture: ComponentFixture<PostventaAntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaAntasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaAntasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
