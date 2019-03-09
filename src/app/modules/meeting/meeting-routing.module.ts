import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from '@app/modules/chat/chat.component';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {ChatAddComponent} from '@app/modules/chat/chat-add/chat-add.component';
import {NgModule} from '@angular/core';
import {MeetingListComponent} from '@app/modules/meeting/meeting-list.component';
import {MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardPayComponent} from '@app/modules/card/card-pay/card-pay.component';
import {MeetingCreateComponent} from '@app/modules/meeting/meeting-create/meeting-create.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingListComponent,

    // этот параметр говорит, что только авторизованные пользователи видят эту страницу
    //canActivate: [AuthGuard]
  },
  {
    path: 'meeting-main/:id',
    component: MeetingForOwnerComponent,

    // этот параметр говорит, что только авторизованные пользователи видят эту страницу
    //canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: MeetingCreateComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MeetingRoutingModule {}
