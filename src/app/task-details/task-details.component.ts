import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task } from '../interface/task';
import { StylePropertyObject, TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss','../task/task.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() functionCalls !: TaskComponent;
  @Input() task!: Task;
  @Input() taskForm!: FormGroup;

  public BETA_STATUS_CODES: Map<String,StylePropertyObject> = new Map();
  public TASK_TYPE_CODES_MAP: Map<String,String >= new Map();

  public taskEditMode:boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    this.BETA_STATUS_CODES = this.functionCalls.getCodeMaps().status 
    this.TASK_TYPE_CODES_MAP = this.functionCalls.getCodeMaps().type
  }

  getTaskStatusCode(task:Task): number {
    return this.functionCalls.getTaskStatusCode(task);
  }

  deleteTask(taskId:number) {
    this.functionCalls.deleteTask(taskId);
  }

  updateTask(taskId:number) {
    this.functionCalls.updateTask(taskId,this.task.dueDate);
  }

  completeTask(taskId:number) {
    this.functionCalls.completeTask(taskId);
  }
}
