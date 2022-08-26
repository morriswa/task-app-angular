import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'task-app-angular';
  isLoggedIn$!: Observable<boolean>;

  constructor(private auth0: AuthService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth0.isAuthenticated$;
  }

  


}
