import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, JwtService } from '@app/core';
import { take, map } from 'rxjs/operators';
import decode from 'jwt-decode';

@Injectable()
export class RoleGuard implements CanActivate {
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
      isAuth => {
        const tokenPayload = decode(this.jwtService.getToken());
        return isAuth && !this.jwtService.hasExpired() &&
        (route.data.roles ? route.data.roles.indexOf(tokenPayload.role) !== -1 : true);
      })
    );
  }
}
