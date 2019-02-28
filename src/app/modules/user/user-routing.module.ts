import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/auth';
import { ProfileComponent } from './profile';

const routes: Routes = [
    {
      path: ':id',
      component: ProfileComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
