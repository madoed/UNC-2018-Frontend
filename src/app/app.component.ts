import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, User } from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'auth';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  currentUser: User;
  isAuthenticated: boolean;

  ngOnInit() {
    this.authService.populate();
    this.authService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  toLoginPage() {
    this.router.navigate(['/login']);
  }

  logout() {
    if (this.authService.isAuthenticated) {
      this.authService.logout();
      this.toLoginPage();
    }
  }
}
