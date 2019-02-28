import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
    {
      path: '',
      component: UserListComponent
     },
    {
      path: 'add',
      component: AddUserComponent
    },
    {
      path: 'edit',
      component: EditUserComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserAdminRoutingModule {}
