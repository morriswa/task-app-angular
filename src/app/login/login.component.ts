import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginStatus$: Observable<boolean> = of(false);
  public email:string="";
  
  constructor(private auth0: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getAuthState();
  }

  getAuthState() {
    this.loginStatus$ = this.auth0.isAuthenticated$;

    this.auth0.user$.subscribe({
      next : sub => this.email = sub?.email!,
      error : err => {
        console.error(err);
        setTimeout(() => this.getAuthState(),3000);
      }});
  }

  login() {
    this.auth0.loginWithPopup();
  }

  testLogin() {
    this.http.get(environment.api + "login",{
      headers : {
        "email" : this.email
      } , responseType : "text"
    }).subscribe(obs => {
      console.log(obs)
    });
  }

  logout() {
    this.auth0.logout();
  }

  register() {
    this.auth0.loginWithRedirect();
  }
}
