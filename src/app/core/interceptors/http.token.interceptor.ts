import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment } from '@env';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenPromise: Promise<string> = this.auth.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);

    return tokenObservable.pipe(
      map(authToken => {
        req = req.clone({setHeaders: {
          'Authorization': 'Bearer ' + authToken,
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': environment.api_url
        }});
      }),
      concatMap(request => {
        return next.handle(req);
      }));
  }
}