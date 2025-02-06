import { Routes } from '@angular/router';
import { LoginComponent } from './01 - login/login.component';

export const routes: Routes = [
    {'path': 'login', title: 'Login', component : LoginComponent},
    {path: "**", component: LoginComponent }    

];
