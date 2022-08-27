import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
import { CustomRequest } from '../interface/request';
import { Task } from '../interface/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() PLANNER_ID: number=0;
  @Input() EMAIL: string="";
  planner!: Planner;
  tasks$!: Task[];

  taskForm:FormGroup;

  constructor(private http:HttpClient,private fb:FormBuilder) { 
    this.taskForm = this.fb.group({
      "task-name" : "",
      "task-category" : "",
      "task-details" : "",
      "task-start-date" : undefined,
      "task-due-date" : undefined,
      "task-status" : "",
      "task-type" : ""
    });
  }

  ngOnInit(): void {
    this.getTasks()
  }

  toDateObj(date:Date): Date {
    return new Date(date);
  }

  getTasks() {
    this.http.get<Planner>(environment.api + "planner",{
      headers : {
        "email" : this.EMAIL,
      } , params : {
        "planner_id" : this.PLANNER_ID
      }
    }).subscribe({
      next : obs => {
        this.tasks$ = Object.assign(new Array<Task>(), obs.tasks);
        console.log(obs)
      },
      error : err => console.error(err)
    })
  }

  addTaskRequest() {
    let TASK_NAME: string = this.taskForm.get("task-name")?.value;
    let TASK_CATEGORY: string = this.taskForm.get("task-category")?.value;
    let TASK_DETAILS: string = this.taskForm.get("task-details")?.value;
    let TASK_STATUS: string = this.taskForm.get("task-status")?.value;
    let TASK_TYPE: string = this.taskForm.get("task-type")?.value;
    let START_DATE: Date | null = this.taskForm.get("task-start-date")?.value;
    let DUE_DATE: Date | null = this.taskForm.get("task-due-date")?.value;

    let request: CustomRequest = {
      "task-name" : TASK_NAME,
      "planner-id" : this.PLANNER_ID
    };

    if (TASK_CATEGORY.length > 0) {
      request['task-category'] = TASK_CATEGORY;
    }

    if (TASK_DETAILS.length > 0) {
      request['task-details'] = TASK_DETAILS;
    }

    if (TASK_STATUS.length > 0) {
      request['task-status'] = TASK_STATUS;
    }

    if (TASK_TYPE.length > 0) {
      request['task-type'] = TASK_TYPE;
    }

    if (START_DATE != null) {
      request['start-year'] = START_DATE.getFullYear();
      request['start-month'] = START_DATE.getMonth();
      request['start-day'] = START_DATE.getDate();
    }

    if (DUE_DATE != null) {
      request['due-year'] = DUE_DATE.getFullYear();
      request['due-month'] = DUE_DATE.getMonth();
      request['due-day'] = DUE_DATE.getDate();
    }

    this.http.post<Planner>(environment.api + "task/add",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
      next : obs => this.tasks$ = Object.assign(new Array<Task>(), obs.tasks),
      error : err => console.error(err)
    });
  }

  deleteTask(taskId:number) {
    let TASK_ID = taskId;
    this.http.delete<Planner>(environment.api + "task/del",{
      headers : {
        "email" : this.EMAIL
      }, body : {
        "planner-id" : this.PLANNER_ID,
        "task-id" : TASK_ID
      }
    }).subscribe({
      next : obs => this.tasks$ = Object.assign(new Array<Task>(), obs.tasks),
      error : err => console.error(err)
    });
  }

}
