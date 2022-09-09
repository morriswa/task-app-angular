import { Task } from "./task";

export interface Planner {
    id:number;
    user:JSON;
    name:string;
    creationDate:Date | undefined;
    startDate:Date | undefined;
    finishDate:Date | undefined;
    goal:string;
    tasks:Task[];
}
