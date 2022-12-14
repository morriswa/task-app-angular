import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from '../interface/planner';
import { CustomRequest } from '../interface/request';

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

  constructor(private http: HttpClient,private fb:FormBuilder) {
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
    this.planners$ = this.http.get(environment.api + "planners",{
      headers : {
        "email" : this.EMAIL
      },
      responseType:"text"
    }).pipe(
      map(obs => {
        let response_obj = JSON.parse(obs);
        console.log(response_obj['message'])
        let planners = Object.assign(new Array<Planner>(), response_obj['planners']); 
        planners.forEach((planner:Planner) => {
          planner.creationDate = (planner.creationDate != undefined && planner.creationDate != null)? new Date(planner.creationDate) : undefined;
          planner.startDate = (planner.startDate != undefined && planner.startDate != null)? new Date(planner.startDate) : undefined;
          planner.finishDate = (planner.finishDate != undefined && planner.finishDate != null)? new Date(planner.finishDate) : undefined;
        });
        return planners;
      })
    );

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
    this.http.post(environment.api + "login",{},{
      headers: {
        "email" : this.EMAIL
      }
    }).subscribe(obs => console.log(obs));
  }
  
  newPlannerRequest(): void {
    let PLANNER_NAME: string = this.plannerFormField.get("planner-name")?.value;
    let PLANNER_GOAL: string = this.plannerFormField.get("planner-goal")?.value;
    let PLANNER_START: Date | undefined = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | undefined = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {};
    
    request['planner-name'] = PLANNER_NAME

    if ((PLANNER_GOAL||[]).length > 0) {
      request['planner-goal'] = PLANNER_GOAL
    } 

    if (PLANNER_START != undefined) {
      request['start-greg'] = PLANNER_START.getTime();
    }

    if (PLANNER_FINISH != undefined) {
      request['finish-greg'] = PLANNER_FINISH.getTime();

    }

    this.http.post<Planner[]>(environment.api + "planner",request,{
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
    let PLANNER_START: Date | undefined = this.plannerFormField.get("planner-start-date")?.value;
    let PLANNER_FINISH: Date | undefined = this.plannerFormField.get("planner-end-date")?.value;

    let request: CustomRequest = {
      "planner-id" : id
    };
    
    if ((PLANNER_NAME||[]).length > 0) {
      request['planner-name'] = PLANNER_NAME;
    } 

    if ((PLANNER_GOAL||[]).length > 0) {
      request['planner-goal'] = PLANNER_GOAL
    } 

    if (PLANNER_START != undefined) {
      request['start-greg'] = PLANNER_START.getTime();
    }

    if (PLANNER_FINISH != undefined) {
      request['finish-greg'] = PLANNER_FINISH.getTime();
    }

    this.http.patch<Planner[]>(environment.api + "planner",request,{
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
    this.http.delete<Planner[]>(environment.api + "planner",{
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
