import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginStatus: boolean = false;

  private email:string="";
  constructor(private auth0: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.auth0.isAuthenticated$.subscribe(obs => {
      this.loginStatus = obs;
    });
    this.auth0.user$.subscribe(sub => {
      this.email = sub?.email!;
    });
  }

  login() {
    this.auth0.loginWithRedirect();

  }

  testLogin() {
    this.http.get(environment.api + "login",{
      headers : {
        "email" : this.email
      } , responseType : "text"
    }).subscribe(obs => {
      console.log(obs)
    })
  }

  logout() {
    this.auth0.logout();
  }

  register() {
    this.http.post(environment.api + "login/register",{},{
      headers: {
        "email" : this.email
      }
    }).subscribe(obs => {
      console.log(obs);
    })
  }
}
