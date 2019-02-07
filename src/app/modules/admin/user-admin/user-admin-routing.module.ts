import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListComponent } from './user-list/user-list.component';

import { RoleGuard } from '@app/auth';
import { Role } from '@app/core';

const routes: Routes = [
    {
      path: '',
      component: UserListComponent,
      canActivate: [RoleGuard],
      data: { roles: [Role.Admin] }
     },
    {
      path: 'add',
      component: AddUserComponent,
      canActivate: [RoleGuard],
      data: { roles: [Role.Admin] }
    },
    {
      path: 'edit',
      component: EditUserComponent,
      canActivate: [RoleGuard],
      data: { roles: [Role.Admin] }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserAdminRoutingModule {}
