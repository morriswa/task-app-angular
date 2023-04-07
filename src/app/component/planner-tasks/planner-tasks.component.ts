import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomRequest } from 'src/app/interface/request';
import { Task } from 'src/app/interface/task';
import { TaskStatusEnum } from 'src/app/interface/task';
import { map, Observable, of } from 'rxjs';
import { TaskService } from 'src/app/service/task.service';

export interface StylePropertyObject {
  friendly : string;
  precedence : number;
  css : string;
} 

/**
 * This component runs the Unique Task Menu located within every Planner
 */
@Component({
  selector: 'app-task',
  templateUrl: './planner-tasks.component.html',
  styleUrls: ['./planner-tasks.component.scss']
})
export class PlannerTasksComponent implements OnInit {
  /**
   * Required Planner ID to use in API calls
   */
  @Input() PLANNER_ID!: number;
   
  // STATE
  public taskobs$: Observable<Task[]> = of([]);
  public cats$: Observable<string[]> = of([]);
  public taskEditMode:boolean = false;

  public taskForm: FormGroup;

  constructor(private fb:FormBuilder, private tasks:TaskService) { 
    this.taskForm = this.fb.group({
      "task-name" : "",
      "task-category" : "",
      "task-details" : "",
      "task-start-date" : undefined,
      "task-due-date" : undefined,
      "task-complete-date" : undefined,
      "task-due-time" : undefined,
      "task-status" : "",
      "task-type" : ""
    });
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskobs$ = this.tasks.getTasks(this.PLANNER_ID);
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

  getTaskStatusCode(task:Task): number {
    return TaskStatusEnum[<keyof typeof TaskStatusEnum> task.status];
  }

  addTaskRequest() {
    let TASK_NAME: string = this.taskForm.get("task-name")?.value;
    let TASK_CATEGORY: string = this.taskForm.get("task-category")?.value;
    let TASK_DETAILS: string = this.taskForm.get("task-details")?.value;
    let TASK_STATUS: string = this.taskForm.get("task-status")?.value;
    let TASK_TYPE: string = this.taskForm.get("task-type")?.value;
    let START_DATE: Date | undefined = this.taskForm.get("task-start-date")?.value;
    let DUE_DATE: Date | undefined = this.taskForm.get("task-due-date")?.value;
    let DUE_TIME: string = this.taskForm.get("task-due-time")?.value;

    let request: any = {
      "title" : TASK_NAME,
      "plannerId" : this.PLANNER_ID
    };

    if (TASK_CATEGORY) {
      request['category'] = TASK_CATEGORY;
    }

    if (TASK_DETAILS) {
      request['details'] = TASK_DETAILS;
    }

    if (TASK_STATUS) {
      request['status'] = TASK_STATUS;
    }

    if (TASK_TYPE) {
      request['type'] = TASK_TYPE;
    }

    if (START_DATE) {
      START_DATE.setHours(0,0)
      request['startDate'] = START_DATE.getTime();
    }

    if (DUE_DATE) {
      if ((DUE_TIME || []).length > 0) {
        DUE_DATE.setHours(Number(DUE_TIME.substring(0,2)),Number(DUE_TIME.substring(3,5)))
      } else {
        DUE_DATE.setHours(23,59)
      }

      request['dueDate'] = DUE_DATE.getTime();
    }

    this.tasks.addTask(request)
    .subscribe({
      next : () => {
        this.getTasks();
        this.taskForm.reset();
      }, 
      error : err => console.error(err)
    });
  }

  deleteTask(taskId:number) {
    this.tasks.deleteTask(this.PLANNER_ID, taskId)
    .subscribe({
      next : () => {
        this.getTasks();
        this.taskEditMode = false;
      }, 
      error : err => console.error(err)
    });
  }

  updateTask(taskId:number,dueDate?:Date) {
    let TASK_NAME: string = this.taskForm.get("task-name")?.value;
    let TASK_CATEGORY: string = this.taskForm.get("task-category")?.value;
    let TASK_DETAILS: string = this.taskForm.get("task-details")?.value;
    let TASK_STATUS: string = this.taskForm.get("task-status")?.value;
    let TASK_TYPE: string = this.taskForm.get("task-type")?.value;
    let START_DATE: Date | undefined = this.taskForm.get("task-start-date")?.value;
    let DUE_DATE: Date | undefined = this.taskForm.get("task-due-date")?.value;
    let COMPLETED_DATE: Date | undefined = this.taskForm.get("task-complete-date")?.value;
    let DUE_TIME: string = this.taskForm.get("task-due-time")?.value;

    let request: CustomRequest = {
      plannerId : this.PLANNER_ID,
      taskId : taskId
    };

    if (TASK_NAME) 
      request.title = TASK_NAME;

    if (TASK_CATEGORY) 
      request.category = TASK_CATEGORY;

    if (TASK_DETAILS) 
      request.details = TASK_DETAILS;

    if (TASK_STATUS) 
      request.status = TASK_STATUS;
    
    if (TASK_TYPE) 
      request.type = TASK_TYPE;


    if (START_DATE) {
      START_DATE.setHours(0,0)
      request.startDate = START_DATE.getTime();
    }

    if ( DUE_DATE || DUE_TIME ) {
      if (DUE_DATE == undefined && dueDate != undefined) {
        DUE_DATE = dueDate!
      } 
      
      if (DUE_DATE == undefined) {
        throw new Error('bad')
      }

      if ((DUE_TIME || []).length > 0) {
        DUE_DATE.setHours(Number(DUE_TIME.substring(0,2)),Number(DUE_TIME.substring(3,5)))
      } else if (dueDate != undefined) {
        DUE_DATE.setHours(dueDate.getHours(),dueDate.getMinutes())
      }

      request.dueDate = DUE_DATE.getTime();
    }

    if (COMPLETED_DATE) 
      request.finishDate = COMPLETED_DATE.getTime();

    this.tasks.updateTask(request)
    .subscribe({
      next : () => {
        this.getTasks();
        this.taskForm.reset();
        this.taskEditMode = false;
      }, error : err => console.error(err)
    }); 
  }

  completeTask(taskId:number) {
    let COMPLETED_DATE: Date | undefined = this.taskForm.get("task-complete-date")?.value;

    let request: CustomRequest = {
      plannerId: this.PLANNER_ID,
      taskId: taskId
    };

    request.status = "COMPLETED";

    if (COMPLETED_DATE) 
      request.finishDate = COMPLETED_DATE.getTime();

    this.tasks.completeTask(request)
    .subscribe({
      next : () => {
        this.getTasks();
        this.taskForm.reset();
        this.taskEditMode = false;
      }, 
      error : err => console.error(err)
    }); 
  }
}
