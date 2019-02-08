import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared';

import {ChatComponent} from '@app/modules/chat/chat.component';
import {ChatRoutingModule} from '@app/modules/chat/chat-routing.module';

import {MessagesComponent} from '@app/modules/messages/messages.component';

@NgModule({
    imports: [
        SharedModule,
        ChatRoutingModule,
        /*FormsModule,
        MatGridListModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatSnackBarModule,
        MatCardModule*/
    ],
    declarations: [ChatComponent, MessagesComponent]
})
export class ChatModule { }