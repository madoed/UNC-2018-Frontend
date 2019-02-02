import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard, NoAuthGuard } from './guards';
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
    AuthService,
    AuthGuard,
    NoAuthGuard
  ]
})
export class AuthModule { }
