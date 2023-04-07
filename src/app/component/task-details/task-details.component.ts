import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task, TaskStatusEnum } from 'src/app/interface/task';
import { StylePropertyObject, PlannerTasksComponent } from '../planner-tasks/planner-tasks.component';
import { TASK_STATUS_OBJ, TASK_TYPE_OBJ } from 'src/app/constants';

/**
 * Displays all available Task info and update menus
 */
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  /**
   * Required Object that implements Update and Delete Task Methods
   */
  @Input() functionCalls !: any;

  /**
   * Required Task to display
   */
  @Input() task!: Task;

  /**
   * Required Task Form for the User to manipulate
   */
  @Input() taskForm!: FormGroup;

  public BETA_STATUS_CODES: Map<String,StylePropertyObject> = TASK_STATUS_OBJ;
  public TASK_TYPE_CODES_MAP: Map<String,String> = TASK_TYPE_OBJ;
  
  public taskEditMode:boolean = false;
  
  constructor() { }

  ngOnInit(): void { }
}
