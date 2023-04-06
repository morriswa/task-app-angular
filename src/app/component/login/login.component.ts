import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginStatus$: Observable<boolean> = of(false);
  public email:Observable<string>=of("");
  public APP_VERSION:string = environment.app_version
  constructor(private auth0: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getAuthState();
  }

  getAuthState() {
    this.loginStatus$ = this.auth0.isAuthenticated$;

    this.email = this.auth0.user$.pipe(map(user=>user?.email!));
  }

  login() {
    this.auth0.loginWithRedirect();
  }


  logout() {
    this.auth0.logout();
  }

  register() {
    this.auth0.loginWithRedirect();
  }
}
