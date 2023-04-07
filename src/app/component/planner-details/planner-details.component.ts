import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-planner-details',
  templateUrl: './planner-details.component.html',
  styleUrls: ['./planner-details.component.scss']
})
export class PlannerDetailsComponent implements OnInit {
  @Input() planner!: any;
  @Input() plannerForm!:FormGroup;
  @Input() funcs!: any;
  @Input() editPlannerMode!: boolean;
  
  constructor() { }

  ngOnInit(): void { }

}
