import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TASK_STATUS_OBJ, TASK_TYPE_OBJ } from 'src/app/constants';
import { TaskStatusEnum } from 'src/app/interface/task';

export interface StylePropertyObject {
  friendly : string;
  precedence : number;
  css : string;
} 

/**
 * A View for all Task Add/Update Forms
 */
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  public BETA_STATUS_CODES: Map<String,StylePropertyObject> = TASK_STATUS_OBJ;
  public TASK_TYPE_CODES_MAP: Map<String,String> = TASK_TYPE_OBJ; 

  @Input() taskForm!:FormGroup;

  constructor() { }

  ngOnInit(): void { }
}
