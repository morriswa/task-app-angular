export type TaskStatus = "BACKLOG" 
    |"NEW"
    |"STARTED"
    |"IN_PROGRESS"
    |"PAST_DUE"
    |"REVIEW"
    |"COMPLETED"
    |"TURNED_IN"
    |"CLOSED"
    |"EXPIRED";

export type TaskType = "TASK"
    |"ASSIGNMENT"
    |"STUDY"
    |"QUIZ"
    |"TEST"
    |"GRADED_ASSIGNMENT"
    |"PROJECT"
    |"TAKE_HOME_QUIZ"
    |"TAKE_HOME_TEST";

export enum TaskStatusEnum {
    BACKLOG = -1,
    NEW = 0,
    STARTED = 0,
    IN_PROGRESS =0,
    PAST_DUE=-1,
    REVIEW=1,
    // COMPLETE MARKERS
    COMPLETED=2,
    TURNED_IN=2,
    CLOSED=2,
    EXPIRED=3
}
    
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
    status: TaskStatus;
    type: TaskType;
}
