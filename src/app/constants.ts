import { TaskStatusEnum } from "./interface/task";

export const TASK_STATUS_OBJ = new Map([
  ["BACKLOG",{
    "friendly" : "Backlog",
    "precedence" : TaskStatusEnum.BACKLOG,
    "css" : "OLD"}],
  ["PAST_DUE",{
    "friendly" : "Overdue",
    "precedence" : TaskStatusEnum.PAST_DUE,
    "css" : "OLD"}],
  ["NEW",{
    "friendly" : "New",
    "precedence" : TaskStatusEnum.NEW,
    "css" : "STARTED"}],
  ["STARTED",{
    "friendly" : "Started",
    "precedence" : TaskStatusEnum.STARTED,
    "css" : "STARTED"}],
  ["IN_PROGRESS",{
    "friendly" : "In Progress",
    "precedence" : TaskStatusEnum.IN_PROGRESS,
    "css" : "STARTED"}],
  ["REVIEW",{
    "friendly" : "Review",
    "precedence" : TaskStatusEnum.REVIEW,
    "css" : "REVIEW"}],
  ["COMPLETED",{
    "friendly" : "Complete",
    "precedence" : TaskStatusEnum.COMPLETED,
    "css" : "DONE"}],
  ["TURNED_IN",{
    "friendly" : "Submitted",
    "precedence" : TaskStatusEnum.TURNED_IN,
    "css" : "DONE"}],
  ["CLOSED",{
    "friendly" : "Closed",
    "precedence" : TaskStatusEnum.CLOSED,
    "css" : "DONE"}],
  ["EXPIRED",{
    "friendly" : "Expired",
    "precedence" : TaskStatusEnum.EXPIRED,
    "css" : "EXPIRED"}],
])
        
export const TASK_TYPE_OBJ = new Map([ 
  ["TASK","Task"],
  ["ASSIGNMENT","Assignment"],
  ["QUIZ","Quiz"],
  ["TEST","Test"],
  ["GRADED_ASSIGNMENT","Graded Assignment"],
  ["PROJECT","Project"],
  ["TASK_HOME_QUIZ","Take Home Quiz"],
  ["TASK_HOME_TEST","Take Home Test"],
]);
