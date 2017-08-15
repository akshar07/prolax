import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PagerService } from 'pagination';
import { HomeComponent } from './home/home.component';
import {appRoutes} from './app.routes';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth.service';
import { ProjectFilterPipe } from './shared/project-filter.pipe';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { LoginRouteGuard } from './auth/login-route-guard';
import { QaComponent } from './qa/qa.component';
import { Qc1Component } from './qc1/qc1.component';
import { Qc2Component } from './qc2/qc2.component';
import { QcResultsComponent } from './qc-results/qc-results.component';
import { CloseoutComponent } from './closeout/closeout.component';
import { Http } from '@angular/http';
import { AddUSersComponent } from './add-users/add-users.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProjectFilterPipe,
    ProjectdetailsComponent,
    QaComponent,
    Qc1Component,
    Qc2Component,
    QcResultsComponent,
    CloseoutComponent,
    AddUSersComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    RouterModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule ,
      RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [ PagerService,AuthService,LoginRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
