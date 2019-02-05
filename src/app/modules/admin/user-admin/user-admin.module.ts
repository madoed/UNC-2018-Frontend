import { NgModule } from '@angular/core';

import { UserAdminRoutingModule } from './user-admin-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserAdminComponent } from './user-admin.component';

@NgModule({
  declarations: [
    UserAdminComponent,
    AddUserComponent,
    EditUserComponent
  ],
  imports: [
    UserAdminRoutingModule
  ]
})
export class UserAdminModule { }
