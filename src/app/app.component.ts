import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meetup';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.init();
  }
}
