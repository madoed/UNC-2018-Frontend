import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/user/profile', pathMatch: 'full' },
  { path: 'map', loadChildren: './modules/map/map.module#MapModule' },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule' },
  {path: 'card-list', loadChildren: './modules/card/card-list/card-list.module#CardListModule'},
  {path: 'chat', loadChildren: './modules/chat/chat.module#ChatModule'},
  {path: 'meeting-list', loadChildren: './modules/meeting/meeting-list.module#MeetingListModule'},
  {path: 'check-list', loadChildren: './modules/check/check-list.module#CheckListModule'},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
