import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'auth';

  constructor(
      private router: Router,
      private authService: AuthService
  ) { }

  logout() {
    if (this.authService.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
