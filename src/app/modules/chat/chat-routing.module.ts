import {RouterModule, Routes} from '@angular/router';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardPayComponent} from '@app/modules/card/card-pay/card-pay.component';
import {NgModule} from '@angular/core';
import {ChatComponent} from '@app/modules/chat/chat.component';
import {Message} from 'stompjs';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {ChatAddComponent} from '@app/modules/chat/chat-add/chat-add.component';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: 'start/:id',
        component: MessagesComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: 'add',
        component: ChatAddComponent,
        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class ChatRoutingModule {}