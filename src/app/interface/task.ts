export type TaskStatusVals = "BACKLOG" 
    |"NEW"
    |"STARTED"
    |"IN_PROGRESS"
    |"PAST_DUE"
    |"REVIEW"
    |"COMPLETED"
    |"TURNED_IN"
    |"CLOSED"
    |"EXPIRED";

export type TaskTypeVals = "TASK"
    |"ASSIGNMENT"
    |"STUDY"
    |"QUIZ"
    |"TEST"
    |"GRADED_ASSIGNMENT"
    |"PROJECT"
    |"TAKE_HOME_QUIZ"
    |"TAKE_HOME_TEST";


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
    status: TaskStatusVals;
    type: TaskTypeVals;
}
