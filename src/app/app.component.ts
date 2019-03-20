import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, User } from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meetup';
  mes: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.authService.init();
  }
}
