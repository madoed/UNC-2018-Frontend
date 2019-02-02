import { NgModule } from '@angular/core';

import { UserAdminModule } from './user-admin/user-admin.module';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [
    UserAdminModule,
    UserRoutingModule
  ]
})
export class UserModule { }
