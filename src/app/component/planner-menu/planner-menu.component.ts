import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from 'src/app/interface/planner';
import { CustomRequest } from 'src/app/interface/request';
import { TaskService } from 'src/app/service/task.service';

/**
 * A menu to manage and create of all a User's Planners
 */
@Component({
  selector: 'app-planner-menu',
  templateUrl: './planner-menu.component.html',
  styleUrls: ['./planner-menu.component.scss']
})
export class PlannerComponent implements OnInit {
   /**
   * Required string input of Authenticated User's Email
   */
   @Input() public EMAIL!:string;
   
  // STATE
  public EDITING_PLANNER:boolean = false;
  public LOADED_SUCCESSFULLY:boolean = false;

  public planners$:Observable<Planner[]>=of([]);

  public plannerFormField:FormGroup;

  constructor(private taskService:TaskService,private fb:FormBuilder) {
    this.plannerFormField = this.fb.group({
      "planner-name" : "",
      "planner-goal" : "",
      "planner-start-date" : undefined,
      "planner-end-date" : undefined
    })
  }

  ngOnInit(): void {
    this.getPlanners();
  }

  getPlanners(): void {
    this.planners$ = this.taskService.getAllPlanners();

    this.planners$.subscribe({
      next : () => { // Load the Component if the API responds 200 status
        this.LOADED_SUCCESSFULLY = true;
      }, error : () => { // else try to register the user and retry
        this.registerNewUserRequest();
        setTimeout(() => this.getPlanners(),2000);
      }
    })
  }

  registerNewUserRequest(): void {
    this.taskService.newUser(this.EMAIL!)
    .subscribe(obs => console.log(obs));
  }
  
  newPlannerRequest(): void {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | undefined = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | undefined = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {};
    
    request['name'] = PLANNER_NAME;

    if (PLANNER_GOAL) 
      request['goal'] = PLANNER_GOAL;

    if (PLANNER_START) 
      request['startDate'] = PLANNER_START.getTime();

    if (PLANNER_FINISH)
      request['finishDate'] = PLANNER_FINISH.getTime();
    
    this.taskService.newPlanner(request)
    .subscribe({
      next: () => {
        this.getPlanners();
        this.EDITING_PLANNER = false;
        this.plannerFormField.reset();
      },
      error: (err) => console.error(err)
    }) 
  }

  updatePlanner(id:number) {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | undefined = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | undefined = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {
      plannerId : id
    };
    
    if (PLANNER_NAME) 
      request.name = PLANNER_NAME;

    if (PLANNER_GOAL) 
      request.goal = PLANNER_GOAL;
      
    if (PLANNER_START) 
      request.startDate = PLANNER_START.getTime();

    if (PLANNER_FINISH) 
      request.finishDate = PLANNER_FINISH.getTime();

    this.taskService.updatePlanner(request)
    .subscribe({
      next: () => {
        this.getPlanners();
        this.EDITING_PLANNER = false;
        this.plannerFormField.reset();
      },
      error: (err) => console.error(err)
    }) 
  }

  deletePlanner(plannerIdToDel:number) {
    this.taskService.deletePlanner(plannerIdToDel)
    .subscribe({
      next: () => {
        this.getPlanners();
        this.EDITING_PLANNER = false;
      }, error: (err) => console.error(err)
    }) 
  }
}
