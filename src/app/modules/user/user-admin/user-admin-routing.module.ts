import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAdminComponent } from './user-admin.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
    { path: '', component: UserAdminComponent },
    { path: 'add', component: AddUserComponent },
    { path: 'edit', component: EditUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserAdminRoutingModule {}
