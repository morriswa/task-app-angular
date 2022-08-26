export interface Task {
    id: number;
    planner: JSON;
    title: string;
    creationDate: Date;
    startDate: Date;
    dueDate: Date;
    completedDate: Date;
    category: string;
    description: string;
    status: string;
    type: string;
}
