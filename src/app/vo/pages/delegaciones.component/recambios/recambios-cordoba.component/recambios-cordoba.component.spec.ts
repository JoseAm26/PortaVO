import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecambiosCordobaComponent } from './recambios-cordoba.component';

describe('RecambiosCordobaComponent', () => {
  let component: RecambiosCordobaComponent;
  let fixture: ComponentFixture<RecambiosCordobaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecambiosCordobaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecambiosCordobaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
