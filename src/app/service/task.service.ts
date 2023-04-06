import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from 'src/app/interface/planner';
import { Task } from 'src/app/interface/task';
import { TaskStatus } from 'src/app/interface/task-status';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  constructor(private http:HttpClient) { }


  huh() {
    return this.http.get("https://"+environment.auth.domain+"/userinfo").pipe(tap(res=>console.log(res)));
  }

  // USER OPS
  newUser(email:string) {
    return this.http.post(environment.api + "login",{
      email:email
    });
  }
  
  // PLANNER OPS
  getAllPlanners(email:string) {
    return this.http.get<any>(environment.api + "planners",{
     
    }).pipe(
      map(response_obj => {
        console.log(response_obj['message'])
        let planners = Object.assign(new Array<Planner>(), response_obj['payload']); 
        planners.forEach((planner:Planner) => {
          planner.creationDate = (planner.creationDate != undefined && planner.creationDate != null)? new Date(planner.creationDate) : undefined;
          planner.startDate = (planner.startDate != undefined && planner.startDate != null)? new Date(planner.startDate) : undefined;
          planner.finishDate = (planner.finishDate != undefined && planner.finishDate != null)? new Date(planner.finishDate) : undefined;
        });
        return planners;
      })
    );
  }

  newPlanner(request:any, email:string) {
    return this.http.post<Planner[]>(environment.api + "planner",request,{
      headers : {
        "email" : email
      }
    });
  }

  updatePlanner(request:any, email:string) {
    return this.http.patch<Planner[]>(environment.api + "planner",request,{
      headers : {
        "email" : email
      }
    });
  }

  deletePlanner(plannerIdToDel:number) {
    return this.http.delete<Planner[]>(environment.api + "planner",{
     body : {
        "plannerId" : plannerIdToDel
      }
    });
  }

  // TASK OPS
  getTasks(plannerId:number) {
    return this.http.get<any>(environment.api + "planner",{
      params : {
        "id" : plannerId
      }
    }).pipe(
      map(response_obj => {
        console.log(response_obj['message'])
        let planner:Planner = response_obj['payload']['plannerInfo'];
        let newtaskarray:Task[] = Array.from(response_obj['payload']['tasks']);
        planner.tasks = newtaskarray;
      
        newtaskarray.forEach(task => {
          task.startDate = (task.startDate != undefined)? new Date(task.startDate) : undefined;
          task.dueDate = (task.dueDate != undefined)? new Date(task.dueDate) : undefined;
          task.completedDate = (task.completedDate != undefined)? new Date(task.completedDate) : undefined;
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
    }));
  }

  addTask(request:any,email:string) {
    return this.http.post<Task[]>(environment.api + "task",request,{
      headers : {
        "email" : email
      }
    })
  }

  updateTask(request:any, email:string) {
    return this.http.patch(environment.api + "task",request,{
      headers : {
        "email" : email
      }
    })
  }

  completeTask(request:any, email:string) {
    return this.http.patch(environment.api + "task",request,{
      headers : {
        "email" : email
      }
    })
  }
  
  deleteTask(plannerId:number, taskId:number) {
    return this.http.delete<Planner>(environment.api + "task",{
      body : {
        "plannerId" : plannerId,
        "taskId" : taskId
      }
    });
  }
 
}