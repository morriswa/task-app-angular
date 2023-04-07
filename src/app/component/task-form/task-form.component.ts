import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaskStatusEnum } from 'src/app/interface/task';

export interface StylePropertyObject {
  friendly : string;
  precedence : number;
  css : string;
} 

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  // CRAP 
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

  @Input() taskForm!:FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
