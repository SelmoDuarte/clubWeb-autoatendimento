import { Routes } from '@angular/router';
import { LoginComponent } from './01 - login/login.component';
import { HomeComponent } from './00 - commons/home/home.component';
import { AuthGuard } from './00 - commons/auth/auth.guards';

export const routes: Routes = [
    {'path': 'home',  component : HomeComponent, canActivate: [AuthGuard]},
    {'path': 'login', title: 'Login', component : LoginComponent},
    {path: "**", component: LoginComponent }    

];
