import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, of, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
import { UserProfile } from '../interface/user-profile';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit,OnDestroy {

  public email:string="";
  public planners$:Planner[]=[];

  public plannerFormField:FormGroup;
  constructor(private auth0: AuthService,private http: HttpClient,private fb:FormBuilder) {
    auth0.getUser().subscribe({
      next : (user) => this.email = user?.email!
    })
    this.getEmail()

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

  getPlanners() {
    this.http.get<Planner[]>(environment.api + "planner/all",{
      headers : {
        "email" : this.email
      }
    }).subscribe({
      next : obs => this.planners$ = Object.assign(new Array<Planner>(), obs), 
      error : err => {
        this.http.post(environment.api + "login/register",{},{
          headers: {
            "email" : this.email
          }
        }).subscribe(obs => {
          console.log(obs);
        });
        this.getPlanners();
      }
    })
  }

  ngOnDestroy(): void {
  }

  getEmail(): void {
    this.auth0.user$.subscribe({
      next : (user) => this.email = user?.email!,
      error : (err) => console.error(err)
    });
  }
  
  newPlannerRequest() {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | null = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | null = this.plannerFormField.get("planner-end-date")?.value;

    let request: {
      "planner-name"? : string,
      "planner-goal"? : string,
      "start-year"? : number, 
      "start-month"? : number, 
      "start-day"?: number,
      "finish-year"? : number, 
      "finish-month"? : number, 
      "finish-day"?: number
    } = {};
    
    if (PLANNER_GOAL.length > 0) {
      request['planner-name'] = PLANNER_NAME,
      request['planner-goal'] = PLANNER_GOAL
    } else {
      request['planner-name'] = PLANNER_NAME
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
        "email" : this.email
      }
    }).subscribe({
      next: (planners) => this.planners$ = Object.assign(new Array<Planner>(),planners),
      error: (err) => console.error(err)
    }) 
  }

  deletePlanner(plannerIdToDel:number) {
    this.http.delete<Planner[]>(environment.api + "planner/del",{
      headers : {
        "email" : this.email
      }, body : {
        "planner-id" : plannerIdToDel
      }
    }).subscribe({
      next: (planners) => this.planners$ = Object.assign(new Array<Planner>(),planners),
      error: (err) => console.error(err)
    }) 
  }

  toDateObj(date:Date): Date {
    return new Date(date);
  }
}
