import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task, TaskStatusEnum } from 'src/app/interface/task';
import { StylePropertyObject, TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss','../task/task.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() functionCalls !: TaskComponent;
  @Input() task!: Task;
  @Input() taskForm!: FormGroup;

getCodeMaps(): { status:Map<String,StylePropertyObject>,type:Map<String,String> } {
    return { 
      status:new Map(
      [ ["BACKLOG",{
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
        ]),type:new Map(
          [ ["TASK","Task"],
            ["ASSIGNMENT","Assignment"],
            ["QUIZ","Quiz"],
            ["TEST","Test"],
            ["GRADED_ASSIGNMENT","Graded Assignment"],
            ["PROJECT","Project"],
            ["TASK_HOME_QUIZ","Take Home Quiz"],
            ["TASK_HOME_TEST","Take Home Test"],
        ])};
  }
  public BETA_STATUS_CODES: Map<String,StylePropertyObject> = this.getCodeMaps().status
  public TASK_TYPE_CODES_MAP: Map<String,String> = this.getCodeMaps().type
  public taskEditMode:boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
}
