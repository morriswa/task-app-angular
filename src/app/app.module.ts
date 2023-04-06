// NG
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// auth0
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

// NG Material
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import { MatCardModule} from '@angular/material/card';
import { MatTabsModule} from '@angular/material/tabs';
import { MatButtonToggleModule} from '@angular/material/button-toggle';

// APP
import { environment as env } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { PlannerComponent } from './component/planner/planner.component';
import { TaskComponent } from './component/task/task.component';
import { TaskDetailsComponent } from './component/task-details/task-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlannerComponent,
    TaskComponent,
    TaskDetailsComponent 
  ],
  imports: [
    MatButtonToggleModule,
    MatTabsModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatExpansionModule,
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
        scope: 'develop:demo',
  
        // Specify configuration for the interceptor              
        httpInterceptor: { allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: env.auth.audience + '*',
            tokenOptions: {
              // The attached token should target this audience
              audience: env.auth.audience,
  
              // The attached token should have these scopes
              scope: 'develop:demo'
            }
          }
        ]}
      })
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
