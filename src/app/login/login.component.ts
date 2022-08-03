import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginStatus: boolean = false;

  constructor(private auth0: AuthService, private http: HttpClientModule) { }

  ngOnInit(): void {
    this.auth0.isAuthenticated$.subscribe(obs => {
      this.loginStatus = obs;
    })
  }

  login() {
    this.auth0.loginWithRedirect();
  }

  logout() {
    this.auth0.logout();
  }
}
