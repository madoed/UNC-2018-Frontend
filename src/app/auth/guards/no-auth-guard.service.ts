import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@app/core';
import { map , take } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

      console.log(this.authService.getCurrentUser());
      return this.authService.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));

  }
}
