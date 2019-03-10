import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile';
import { ProfileEditComponent } from './profile-edit';
import { SearchComponent } from './search';

const routes: Routes = [
    {
      path: 'search',
      component: SearchComponent
    },
    {
      path: ':id',
      component: ProfileComponent
    },
    {
      path: ':id/edit',
      component: ProfileEditComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
