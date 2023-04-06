import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Planner } from './interface/planner';
import { Task } from './interface/task';
import { TaskStatus } from './interface/task-status';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  deleteTask(email:string, plannerId:number, taskId:number) {
    return this.http.delete<Planner>(environment.api + "task",{
      body : {
        "plannerId" : plannerId,
        "taskId" : taskId
      }
    });
  }
  
  constructor(private http:HttpClient) { }

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

  completeTask(request:any, email:string) {
    return this.http.patch(environment.api + "task",request,{
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
 

}
