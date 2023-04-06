import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from 'src/app/interface/planner';
import { CustomRequest } from 'src/app/interface/request';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  // PUBLIC STATE
  public editPlannerMode = false;
  public planners$:Observable<Planner[]>=of([]);
  public LOADED_SUCCESSFULLY:boolean = false;

  
  // INIT
  @Input() public EMAIL:string="";
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
    // this.getEmail();
    this.getPlanners();
  }

  // getEmail(): void {
  //   this.auth0.user$.subscribe({
  //     next : (user) => this.EMAIL = user?.email!,
  //     error : (err) => {
  //       console.error(err);
  //       setTimeout(() => this.getEmail(),5000);
  //     }
  //   });
  // }

  getPlanners(): void {
    this.planners$ = this.taskService.getAllPlanners(this.EMAIL);

    this.planners$.subscribe({
      next : obs => {
        this.LOADED_SUCCESSFULLY = true;
      }, error : err => {
        this.registerNewUserRequest();
        setTimeout(() => this.getPlanners(),2000);
      }
    })
  }


  // FUNCTIONS
  registerNewUserRequest(): void {
    this.taskService.newUser(this.EMAIL).subscribe(obs => console.log(obs));
  }
  
  newPlannerRequest(): void {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | undefined = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | undefined = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {};
    
    request['name'] = PLANNER_NAME

    if ((PLANNER_GOAL||[]).length > 0) {
      request['goal'] = PLANNER_GOAL
    } 

    if (PLANNER_START != undefined) {
      request['startDate'] = PLANNER_START.getTime();
    }

    if (PLANNER_FINISH != undefined) {
      request['finishDate'] = PLANNER_FINISH.getTime();

    }

    this.taskService.newPlanner(request, this.EMAIL).subscribe({
      next: () => {
        this.getPlanners();
        this.editPlannerMode = false;
        this.plannerFormField.reset();
      },error: (err) => console.error(err)
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
    
    if ((PLANNER_NAME||[]).length > 0) {
      request.name = PLANNER_NAME;
    } 

    if ((PLANNER_GOAL||[]).length > 0) {
      request.goal = PLANNER_GOAL
    } 

    if (PLANNER_START != undefined) {
      request.startDate = PLANNER_START.getTime();
    }

    if (PLANNER_FINISH != undefined) {
      request.finishDate = PLANNER_FINISH.getTime();
    }

    this.taskService.updatePlanner(request,this.EMAIL).subscribe({
      next: () => {
        this.getPlanners();
        this.editPlannerMode = false;
        this.plannerFormField.reset();
      },error: (err) => console.error(err)
    }) 
  }

  deletePlanner(plannerIdToDel:number) {
    this.taskService.deletePlanner(plannerIdToDel)
    .subscribe({
      next: () => {
        this.getPlanners();
        this.editPlannerMode = false;
      }, error: (err) => console.error(err)
    }) 
  }
}
