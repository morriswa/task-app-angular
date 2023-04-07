import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerTasksComponent } from './planner-tasks.component';

describe('TaskComponent', () => {
  let component: PlannerTasksComponent;
  let fixture: ComponentFixture<PlannerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
