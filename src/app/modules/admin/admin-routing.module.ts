import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'user', loadChildren: './user-admin/user-admin.module#UserAdminModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}