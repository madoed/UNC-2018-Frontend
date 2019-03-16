import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*const tokenPromise: Promise<string> = this.auth.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);

    const headersConfig = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      };
    if (!req.headers.has('Do-Not-Set-Content-Type')) {
      headersConfig['Content-Type'] = 'application/json';
    }

    return tokenObservable.pipe(
      map(authToken => {
        req = req.clone({setHeaders: headersConfig});
      }),
      concatMap(request => {
        return next.handle(req);
      }));*/

      const headersConfig = {
        'Accept': 'application/json'
      };
      if (!req.headers.has('Do-Not-Set-Content-Type')) {
        headersConfig['Content-Type'] = 'application/json';
      }
  
      const request = req.clone({ setHeaders: headersConfig });
      return next.handle(request);
  }
}