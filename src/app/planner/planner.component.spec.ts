import { ComponentFixture, TestBed } from '@angular/core/testing';
import { platformBrowser } from '@angular/platform-browser';

import { PlannerComponent } from './planner.component';

describe('TasksComponent', () => {
  let component: PlannerComponent;
  let fixture: ComponentFixture<PlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
