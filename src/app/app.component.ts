import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'task-app-angular';
  login: boolean = false;

  constructor(private auth0: AuthService) {}

  ngOnInit() {
    this.auth0.isAuthenticated$.subscribe(obs => {
      this.login = obs;
    })
  }

  


}
