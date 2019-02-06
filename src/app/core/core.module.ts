import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {ApiService, AuthService, CardService, JwtService, MapService, UserService} from './services';
import { HttpTokenInterceptor } from './interceptors';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthService,
    JwtService,
    MapService,
    CardService,
    UserService
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
