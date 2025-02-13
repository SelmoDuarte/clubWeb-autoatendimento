import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './00 - commons/header/header.component';
import { FooterComponent } from './00 - commons/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from './00 - commons/auth/auth.services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'clubWeb-app';

  isLoggedIn$!: Observable<boolean>;

  constructor( private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    
  }


}
