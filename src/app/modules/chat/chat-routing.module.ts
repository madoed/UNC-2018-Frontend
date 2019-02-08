import {RouterModule, Routes} from '@angular/router';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardPayComponent} from '@app/modules/card/card-pay/card-pay.component';
import {NgModule} from '@angular/core';
import {ChatComponent} from '@app/modules/chat/chat.component';
import {Message} from 'stompjs';
import {MessagesComponent} from '@app/modules/messages/messages.component';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: ':id',
        component: MessagesComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class ChatRoutingModule {}