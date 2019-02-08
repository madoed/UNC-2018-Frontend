import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/auth';
import { Role } from '@app/core';

const routes: Routes = [
  //{ path: '**', redirectTo: '' },
  { path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule' },
  { path: 'map', loadChildren: './modules/map/map.module#MapModule' },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule' },
  {path: 'card-list', loadChildren: './modules/card/card-list/card-list.module#CardListModule'},
  {path: 'chat', loadChildren: './modules/chat/chat.module#ChatModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
