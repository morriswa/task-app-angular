import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Planner } from 'src/app/interface/planner';

/**
 * Displays a Planner's Details, Tasks, and Menus to update
 */
@Component({
  selector: 'app-planner-details',
  templateUrl: './planner-details.component.html',
  styleUrls: ['./planner-details.component.scss']
})
export class PlannerDetailsComponent implements OnInit {
  /**
   * Required Planner to Display
   */
  @Input() planner!: Planner;

  /**
   * Required Planner Form for the User to Edit
   */
  @Input() plannerForm!:FormGroup;

  /**
   * Required Object implementing Update and Delete Planner Methods
   */
  @Input() funcs!: any;

  /**
   * Required Boolean indicating which View to activate
   */
  @Input() editPlannerMode!: boolean;
  
  constructor() { }

  ngOnInit(): void { }
}