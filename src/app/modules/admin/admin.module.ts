import { NgModule } from '@angular/core';

import { UserAdminModule } from './user-admin/user-admin.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [],
  imports: [
    UserAdminModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
