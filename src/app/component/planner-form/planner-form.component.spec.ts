import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlannerComponent } from './planner-form.component';

describe('AddPlannerComponent', () => {
  let component: AddPlannerComponent;
  let fixture: ComponentFixture<AddPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
