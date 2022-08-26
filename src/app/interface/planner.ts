export interface Planner {
    id:number;
    user:JSON;
    name:string;
    creationDate:Date;
    startDate:Date;
    finishDate:Date;
    goal:string;
    tasks:Task[];
}
