import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
import { CustomRequest } from '../interface/request';
import { Task } from '../interface/task';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit} from '@angular/core';
import { TaskStatus } from '../interface/task-status';
import { lastValueFrom, map, Observable, of } from 'rxjs';
import { TaskDetailsComponent } from '../task-details/task-details.component';

export interface StylePropertyObject {
  friendly : string;
  precedence : number;
  css : string;
} 

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit,AfterViewInit {
  // CRAP 
  getCodeMaps(): { status:Map<String,StylePropertyObject>,type:Map<String,String> } {
    return { 
      status:new Map(
      [ ["BACKLOG",{
          "friendly" : "Backlog",
          "precedence" : TaskStatus.BACKLOG,
          "css" : "OLD"}],
        ["PAST_DUE",{
          "friendly" : "Overdue",
          "precedence" : TaskStatus.PAST_DUE,
          "css" : "OLD"}],
        ["NEW",{
          "friendly" : "New",
          "precedence" : TaskStatus.NEW,
          "css" : "STARTED"}],
        ["STARTED",{
          "friendly" : "Started",
          "precedence" : TaskStatus.STARTED,
          "css" : "STARTED"}],
        ["IN_PROGRESS",{
          "friendly" : "In Progress",
          "precedence" : TaskStatus.IN_PROGRESS,
          "css" : "STARTED"}],
        ["REVIEW",{
          "friendly" : "Review",
          "precedence" : TaskStatus.REVIEW,
          "css" : "REVIEW"}],
        ["COMPLETED",{
          "friendly" : "Complete",
          "precedence" : TaskStatus.COMPLETED,
          "css" : "DONE"}],
        ["TURNED_IN",{
          "friendly" : "Submitted",
          "precedence" : TaskStatus.TURNED_IN,
          "css" : "DONE"}],
        ["CLOSED",{
          "friendly" : "Closed",
          "precedence" : TaskStatus.CLOSED,
          "css" : "DONE"}],
        ["EXPIRED",{
          "friendly" : "Expired",
          "precedence" : TaskStatus.EXPIRED,
          "css" : "EXPIRED"}],
        ]),type:new Map(
          [ ["TASK","Task"],
            ["ASSIGNMENT","Assignment"],
            ["QUIZ","Quiz"],
            ["TEST","Test"],
            ["GRADED_ASSIGNMENT","Graded Assignment"],
            ["PROJECT","Project"],
            ["TASK_HOME_QUIZ","Take Home Quiz"],
            ["TASK_HOME_TEST","Take Home Test"],
        ])};
  }
  public BETA_STATUS_CODES: Map<String,StylePropertyObject> = this.getCodeMaps().status
  public TASK_TYPE_CODES_MAP: Map<String,String> = this.getCodeMaps().type
  @ViewChild(TaskDetailsComponent ) child !:any ;


  // STATE
  public taskobs$: Observable<Task[]> = of([]);
  public cats$: Observable<string[]> = of([]);


  // INIT
  @Input() PLANNER_ID: number=0;
  @Input() EMAIL: string="";
  @ViewChild('taskTableSort') sort: MatSort = new MatSort();

  public taskForm: FormGroup;
  public taskEditMode:boolean = false;
  displayedColumns: string[] = ['category','title', 'status', 'dueDate'];
  dataSource = new MatTableDataSource<Task>();

  constructor(private http:HttpClient,private fb:FormBuilder,private _liveAnnouncer: LiveAnnouncer) { 
    this.taskForm = this.fb.group({
      "task-name" : "",
      "task-category" : "",
      "task-details" : "",
      "task-start-date" : undefined,
      "task-due-date" : undefined,
      "task-complete-date" : undefined,
      "task-status" : "",
      "task-type" : ""
    });
  }

  ngOnInit(): void {
    this.getTasks();
  }

  ngAfterViewInit() {
    this.sortTaskTable();
  }

  getTasks() {
    this.taskobs$ = this.http.get<Planner>(environment.api + "planner",{
      headers : {
        "email" : this.EMAIL,
      } , params : {
        "planner_id" : this.PLANNER_ID
      }
    }).pipe(
      map(planner => {
        let newtaskarray = Array.from(planner.tasks);
       
        newtaskarray.forEach(task => {
          task.startDate = (task.startDate != undefined && task.startDate != null)? new Date(task.startDate) : undefined;
          task.dueDate = (task.dueDate != undefined && task.dueDate != null)? new Date(task.dueDate) : undefined;
          task.completedDate = (task.completedDate != undefined && task.completedDate != null)? new Date(task.completedDate) : undefined;
        });

        newtaskarray.sort((a,b)=>{
          if (TaskStatus[<keyof typeof TaskStatus> a.status] > TaskStatus[<keyof typeof TaskStatus> b.status]) {
            return 1
          } else if (TaskStatus[<keyof typeof TaskStatus> a.status] < TaskStatus[<keyof typeof TaskStatus> b.status]) {
            return -1
          } else {
            return (a.dueDate != undefined && b.dueDate != undefined)? a.dueDate.getTime() - b.dueDate.getTime() : -1;
          } 
        }); 

        return newtaskarray;
      })
    );
    this.cats$ = this.taskobs$.pipe(
      map(obs => {
        let tasks = Array.from(obs);
        let getsetgo = new Set<string>();
        tasks.forEach(task => {
          if ((task.category||[]).length > 0) {
            getsetgo.add(task.category);
          }
        })
        return Array.from(getsetgo);
      })
    );
  }


  // HELPERS 
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async sortTaskTable() {
    this.dataSource = new MatTableDataSource(await lastValueFrom(this.taskobs$));
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'dueDate': return item.dueDate!.getTime();
        case 'status' : return (TaskStatus[<keyof typeof TaskStatus> item.status]);
        default: return item.id;
      }
    };
    this.dataSource.sort = this.sort;
  }

  getTaskStatusCode(task:Task): number {
    return TaskStatus[<keyof typeof TaskStatus> task.status];
  }


  // FUNCTIONS
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

    if ((TASK_CATEGORY || []).length > 0) {
      request['task-category'] = TASK_CATEGORY;
    }

    if ((TASK_DETAILS || []).length > 0) {
      request['task-details'] = TASK_DETAILS;
    }

    if ((TASK_STATUS || []).length > 0) {
      request['task-status'] = TASK_STATUS;
    }

    if ((TASK_TYPE || []).length > 0) {
      request['task-type'] = TASK_TYPE;
    }

    if (START_DATE != null && START_DATE != undefined) {
      request['start-year'] = START_DATE.getFullYear();
      request['start-month'] = START_DATE.getMonth();
      request['start-day'] = START_DATE.getDate();
    }

    if (DUE_DATE != null && DUE_DATE != undefined) {
      request['due-year'] = DUE_DATE.getFullYear();
      request['due-month'] = DUE_DATE.getMonth();
      request['due-day'] = DUE_DATE.getDate();
    }

    this.http.post<Planner>(environment.api + "task/add",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
      next : obs => {
        this.getTasks();
        this.sortTaskTable();
        // this.ngOnInit();
        this.taskForm.reset();
      }, error : err => console.error(err)
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
      next : obs => {
        this.getTasks();
        this.sortTaskTable();
        this.taskEditMode = false;
      }, error : err => console.error(err)
    });
  }

  updateTask(taskId:number) {
    let TASK_NAME: string = this.taskForm.get("task-name")?.value;
    let TASK_CATEGORY: string = this.taskForm.get("task-category")?.value;
    let TASK_DETAILS: string = this.taskForm.get("task-details")?.value;
    let TASK_STATUS: string = this.taskForm.get("task-status")?.value;
    let TASK_TYPE: string = this.taskForm.get("task-type")?.value;
    let START_DATE: Date | null = this.taskForm.get("task-start-date")?.value;
    let DUE_DATE: Date | null = this.taskForm.get("task-due-date")?.value;
    let COMPLETED_DATE: Date | null = this.taskForm.get("task-complete-date")?.value;

    let request: CustomRequest = {
      "planner-id" : this.PLANNER_ID,
      "task-id" : taskId
    };

    if ((TASK_NAME || []).length > 0) {
      request['task-name'] = TASK_NAME;
    }

    if ((TASK_CATEGORY || []).length > 0) {
      request['task-category'] = TASK_CATEGORY;
    }

    if ((TASK_DETAILS || []).length > 0) {
      request['task-details'] = TASK_DETAILS;
    }

    if ((TASK_STATUS || []).length > 0) {
      request['task-status'] = TASK_STATUS;
    }

    if ((TASK_TYPE || []).length > 0) {
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

    if (COMPLETED_DATE != null) {
      request['finish-year'] = COMPLETED_DATE.getFullYear();
      request['finish-month'] = COMPLETED_DATE.getMonth();
      request['finish-day'] = COMPLETED_DATE.getDate();
    }

    this.http.patch<Planner>(environment.api + "task/update",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
      next : obs => {
        this.getTasks();
        this.taskForm.reset();
        this.sortTaskTable();
        this.taskEditMode = false;
      }, error : err => console.error(err)
    }); 
  }

  completeTask(taskId:number) {
    let COMPLETED_DATE: Date | null = this.taskForm.get("task-complete-date")?.value;

    let request: CustomRequest = {
      "planner-id" : this.PLANNER_ID,
      "task-id" : taskId
    };

    request['task-status'] = "COMPLETED";

    if (COMPLETED_DATE != null) {
      request['finish-year'] = COMPLETED_DATE.getFullYear();
      request['finish-month'] = COMPLETED_DATE.getMonth();
      request['finish-day'] = COMPLETED_DATE.getDate();
    }

    this.http.patch<Planner>(environment.api + "task/update",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
      next : obs => {
        this.getTasks();
        this.taskForm.reset();
        this.sortTaskTable();
        this.taskEditMode = false;
      }, error : err => console.error(err)
    }); 
  }
}
