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

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit,AfterViewInit {
  public TASK_STATUS_CODES: { enum:string,friendly:string }[] = 
  [ {enum : "BACKLOG",friendly : "Backlog" },
    {enum : "NEW",friendly : "New" },
    {enum : "STARTED",friendly : "Started" },
    {enum : "IN_PROGRESS",friendly : "In Progress" },
    {enum : "PAST_DUE",friendly : "Overdue" },
    {enum : "REVIEW",friendly : "Review" },
    {enum : "COMPLETED",friendly : "Complete" },
    {enum : "TURNED_IN",friendly : "Submitted" },
    {enum : "CLOSED",friendly : "Closed" },
    {enum : "EXPIRED",friendly : "Expired" }];

    public TASK_STATUS_CODES_MAP: Map<String,String> = new Map([
      ["BACKLOG","Backlog"],
      ["NEW","New"],
      ["STARTED","Started"],
      ["IN_PROGRESS","In Progress"],
      ["PAST_DUE","Overdue"],
      ["REVIEW","Review"],
      ["COMPLETED","Complete"],
      ["TURNED_IN","Submitted"],
      ["CLOSED","Closed"],
      ["EXPIRED","Expired"],
    ]);
  
  public TASK_TYPE_CODES: { enum:string,friendly:string }[] =
  [ {enum : "TASK",friendly : "Task" },
    {enum : "ASSIGNMENT",friendly : "Assignment" },
    {enum : "QUIZ",friendly : "Quiz" },
    {enum : "TEST",friendly : "Test" },
    {enum : "GRADED_ASSIGNMENT",friendly : "Graded Assignment" },
    {enum : "PROJECT",friendly : "Project" },
    {enum : "TASK_HOME_QUIZ",friendly : "Take Home Quiz" },
    {enum : "TASK_HOME_TEST",friendly : "Take Home Test" },];

  public TASK_TYPE_CODES_MAP: Map<String,String> = new Map([
    ["TASK","Task"],
    ["ASSIGNMENT","Assignment"],
    ["QUIZ","Quiz"],
    ["TEST","Test"],
    ["GRADED_ASSIGNMENT","Graded Assignment"],
    ["PROJECT","Project"],
    ["TASK_HOME_QUIZ","Take Home Quiz"],
    ["TASK_HOME_TEST","Take Home Test"],
  ])

  @Input() PLANNER_ID: number=0;
  @Input() EMAIL: string="";

  public tasks$: Task[] = [];
  public categories$: string[] = [];

  public taskForm: FormGroup;

  displayedColumns: string[] = ['category','title', 'status', 'dueDate'];
  dataSource = new MatTableDataSource<Task>();

  @ViewChild('taskTableSort') sort: MatSort = new MatSort();

  

  constructor(private http:HttpClient,private fb:FormBuilder
    ,private _liveAnnouncer: LiveAnnouncer
    ) { 
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
    this.fetchCategoryNames();
  }

  ngAfterViewInit() {
    this.sortTaskTable();
    this.fetchCategoryNames();
  }

  fetchCategoryNames() {
    let categories: Set<string> = new Set();
    this.tasks$.forEach(task => { categories.add(task.category)})
    this.categories$ = Array.from(categories);
  }

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

  toDateObj(date:Date): Date {
    return new Date(date);
  }

  sortTaskTable() {
    this.dataSource = new MatTableDataSource(this.tasks$);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'dueDate': return this.toDateObj(item.dueDate).getTime();
        case 'status' : return (TaskStatus[<keyof typeof TaskStatus> item.status]);
        default: return item.id;
      }
    };
    this.dataSource.sort = this.sort;
  }

  getTasks() {
    this.http.get<Planner>(environment.api + "planner",{
      headers : {
        "email" : this.EMAIL,
      } , params : {
        "planner_id" : this.PLANNER_ID
      }
    }).subscribe({
      next : obs =>{
        this.tasks$ = Object.assign(new Array<Task>(), obs.tasks);
        this.tasks$.sort((a,b)=>{
          if (TaskStatus[<keyof typeof TaskStatus> a.status] > TaskStatus[<keyof typeof TaskStatus> b.status]) {
            return 1
          } else if (TaskStatus[<keyof typeof TaskStatus> a.status] < TaskStatus[<keyof typeof TaskStatus> b.status]) {
            return -1
          } else {
            return this.toDateObj(a.dueDate).getTime() - this.toDateObj(b.dueDate).getTime() ;
          } 
        });
        this.sortTaskTable();
        this.fetchCategoryNames();
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
        this.taskForm.reset();
        this.sortTaskTable();
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
      next : obs => this.getTasks(),
      error : err => console.error(err)
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
      }, error : err => console.error(err)
    }); 
  }
}
