import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
