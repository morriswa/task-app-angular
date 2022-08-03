import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AppComponent } from './app.component';
import { MatCommonModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatMenuModule} from '@angular/material/menu'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import { environment as env } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    
    TasksComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    AuthModule.forRoot(
      {
        domain: env.auth.domain,
        clientId: env.auth.clientId,
  
        // Request this audience at user authentication time
        audience: env.auth.audience,
  
        // Request this scope at user authentication time
        scope: 'read:profile',
  
        // Specify configuration for the interceptor              
        httpInterceptor: { allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: env.auth.audience + '*',
            tokenOptions: {
              // The attached token should target this audience
              audience: env.auth.audience,
  
              // The attached token should have these scopes
              scope: 'read:profile'
            }
          }
        ]}
      })
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
