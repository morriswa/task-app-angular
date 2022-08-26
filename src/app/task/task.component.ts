import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
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
      "task-name" : ""
    });
  }

  ngOnInit(): void {
    this.getTasks()
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
    let TASK_NAME = this.taskForm.get("task-name")?.value;
    this.http.post<Planner>(environment.api + "task/add",{
      "task-name" : TASK_NAME,
      "planner-id" : this.PLANNER_ID
    },{
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
