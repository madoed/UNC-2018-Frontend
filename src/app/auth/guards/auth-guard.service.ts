import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, JwtService } from '@app/core';
import { take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.authService.isAuthenticated.pipe(take(1), map(
      isAuth => isAuth && !this.jwtService.hasExpired()));

      /*const canPass: boolean = user && !this.jwtService.hasExpired() &&
      (route.data.roles ? route.data.roles.indexOf(user.role) !== -1 : true);
      if (!canPass) {
          console.log('You shall not pass!')
          this.router.navigate(['/']);
      }
      return canPass;

    return this.authService.currentUser.pipe(take(1), map(
        user => user && !this.jwtService.hasExpired() &&
      (route.data.roles ? route.data.roles.indexOf(user.role) !== -1 : true)));
      */
  }
}
