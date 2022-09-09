export interface Task {
    id: number;
    planner: JSON;
    title: string;
    creationDate: Date;
    startDate: Date | undefined;
    dueDate: Date | undefined;
    completedDate: Date | undefined;
    category: string;
    description: string;
    status: string;
    type: string;
}
