import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostventaMalagaComponent } from './postventa-malaga.component';

describe('PostventaMalagaComponent', () => {
  let component: PostventaMalagaComponent;
  let fixture: ComponentFixture<PostventaMalagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostventaMalagaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostventaMalagaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
