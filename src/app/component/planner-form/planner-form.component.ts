import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-planner-form',
  templateUrl: './planner-form.component.html',
  styleUrls: ['./planner-form.component.scss']
})
export class AddPlannerComponent implements OnInit {
  /**
   * Requires a Form to write User Input into
   */
  @Input() plannerForm!: FormGroup;

  constructor() { }

  ngOnInit(): void { }

}
