import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public APP_TITLE = environment.app_title;
  public APP_VERSION:string = environment.app_version;

  public loginStatus$: Observable<boolean> = of(false);
  public email$:Observable<string>=of("");

  constructor(private auth0: AuthService) { }

  ngOnInit(): void {
    // get observables for required data from Auth Service
    this.loginStatus$ = this.auth0.isAuthenticated$;
    this.email$ = this.auth0.user$.pipe(map(user=>user?.email!));
  }

  login() {
    this.auth0.loginWithRedirect();
  }

  logout() {
    this.auth0.logout();
  }

  register() {
    this.auth0.loginWithPopup();
  }
}
