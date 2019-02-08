import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard, NoAuthGuard, RoleGuard } from './guards';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    RoleGuard
  ]
})
export class AuthModule { }
