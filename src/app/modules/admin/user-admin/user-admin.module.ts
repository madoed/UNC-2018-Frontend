import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { UserAdminRoutingModule } from './user-admin-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    UserListComponent,
    AddUserComponent,
    EditUserComponent
  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule
  ]
})
export class UserAdminModule { }
