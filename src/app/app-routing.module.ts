import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MaterialComponent } from './material/material.component';
import { AuthGuard } from './share/auth.guard';
import { RestaurantdashComponent } from './restaurantdash/restaurantdash.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'restaurent', component: RestaurantdashComponent,
    canActivate: [AuthGuard]
  },
  { path: 'material', component: MaterialComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
