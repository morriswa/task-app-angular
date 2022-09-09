import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
import { CustomRequest } from '../interface/request';
import { UserProfile } from '../interface/user-profile';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  // PUBLIC STATE
  public LOADED_SUCCESSFULLY:boolean = false;
  public editPlannerMode = false;

  public EMAIL:string="";
  public planners$:Observable<Planner[]>=of([]);

  
  // INIT
  public plannerFormField:FormGroup;

  constructor(private auth0: AuthService,private http: HttpClient,private fb:FormBuilder) {
    this.plannerFormField = this.fb.group({
      "planner-name" : "",
      "planner-goal" : "",
      "planner-start-date" : undefined,
      "planner-end-date" : undefined
    })
  }

  ngOnInit(): void {
    this.getEmail();
    this.getPlanners();
  }

  getEmail(): void {
    this.auth0.user$.subscribe({
      next : (user) => this.EMAIL = user?.email!,
      error : (err) => {
        console.error(err);
        setTimeout(() => this.getEmail(),5000);
      }
    });
  }

  getPlanners(): void {
    this.planners$ = this.http.get<Planner[]>(environment.api + "planner/all",{
      headers : {
        "email" : this.EMAIL
      }
    }).pipe(
      map(obs => {
        obs.forEach(planner => {
          planner.creationDate = (planner.creationDate != undefined && planner.creationDate != null)? new Date(planner.creationDate) : undefined;
          planner.startDate = (planner.startDate != undefined && planner.startDate != null)? new Date(planner.startDate) : undefined;
          planner.finishDate = (planner.finishDate != undefined && planner.finishDate != null)? new Date(planner.finishDate) : undefined;
        });
        return Object.assign(new Array<Planner>(), obs); 
      })
    );

    this.planners$.subscribe({
      next : obs => {
        if ((obs||[]).length > 0) {
          this.LOADED_SUCCESSFULLY = true;
        }
      }, error : err => {
        this.registerNewUserRequest();
        setTimeout(() => this.getPlanners(),2000);
      }
    })
  }


  // FUNCTIONS
  registerNewUserRequest(): void {
    this.http.post(environment.api + "login/register",{},{
      headers: {
        "email" : this.EMAIL
      }
    }).subscribe(obs => console.log(obs));
  }
  
  newPlannerRequest(): void {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | null = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | null = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {};
    
    request['planner-name'] = PLANNER_NAME

    if (PLANNER_GOAL.length > 0) {
      request['planner-goal'] = PLANNER_GOAL
    } 

    if (PLANNER_START != null) {
      request['start-year'] = PLANNER_START.getFullYear();
      request['start-month'] = PLANNER_START.getMonth();
      request['start-day'] = PLANNER_START.getDate();
    }

    if (PLANNER_FINISH != null) {
      request['finish-year'] = PLANNER_FINISH.getFullYear();
      request['finish-month'] = PLANNER_FINISH.getMonth();
      request['finish-day'] = PLANNER_FINISH.getDate();
    }

    this.http.post<Planner[]>(environment.api + "planner/add",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
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
    let PLANNER_START: Date | null = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | null = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {
      "planner-id" : id
    };
    
    if ((PLANNER_NAME||[]).length > 0) {
      request['planner-name'] = PLANNER_NAME;
    } 

    if ((PLANNER_GOAL||[]).length > 0) {
      request['planner-goal'] = PLANNER_GOAL
    } 

    if (PLANNER_START != null) {
      request['start-year'] = PLANNER_START.getFullYear();
      request['start-month'] = PLANNER_START.getMonth();
      request['start-day'] = PLANNER_START.getDate();
    }

    if (PLANNER_FINISH != null) {
      request['finish-year'] = PLANNER_FINISH.getFullYear();
      request['finish-month'] = PLANNER_FINISH.getMonth();
      request['finish-day'] = PLANNER_FINISH.getDate();
    }

    this.http.patch<Planner[]>(environment.api + "planner/update",request,{
      headers : {
        "email" : this.EMAIL
      }
    }).subscribe({
      next: () => {
        this.getPlanners();
        this.editPlannerMode = false;
        this.plannerFormField.reset();
      },error: (err) => console.error(err)
    }) 
  }

  deletePlanner(plannerIdToDel:number) {
    this.http.delete<Planner[]>(environment.api + "planner/del",{
      headers : {
        "email" : this.EMAIL
      }, body : {
        "planner-id" : plannerIdToDel
      }
    }).subscribe({
      next: () => {
        this.getPlanners();
        this.editPlannerMode = false;
      }, error: (err) => console.error(err)
    }) 
  }
}
