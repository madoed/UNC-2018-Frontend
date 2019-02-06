import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/core';
import { User } from '@app/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  currentUser: User;
  isAuthenticated: boolean;

  ngOnInit() {
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
