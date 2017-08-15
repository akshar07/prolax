import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { LoginRouteGuard } from './auth/login-route-guard';
import { AddUSersComponent } from './add-users/add-users.component';
export const appRoutes: Routes = [
  { path: "login", component: AuthComponent},
  { path: "home", component: HomeComponent,canActivate: [LoginRouteGuard]},
  {path:"projectDetail/:id/:manager",component:ProjectdetailsComponent,canActivate: [LoginRouteGuard]},
  {path:"addUsers",component:AddUSersComponent,canActivate: [LoginRouteGuard]},
  { path: '**', component: AuthComponent}
//   { path: 'hero/:id',      component: HeroDetailComponent },
//   {
//     path: 'heroes',
//     component: HeroListComponent,
//     data: { title: 'Heroes List' }
//   },
//   { path: '',
//     redirectTo: '/heroes',
//     pathMatch: 'full'
//   },
//   { path: '**', component: PageNotFoundComponent } canActivate: [LoginRouteGuard]
];