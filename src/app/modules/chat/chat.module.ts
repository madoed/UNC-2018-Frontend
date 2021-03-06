import {NgModule} from '@angular/core';
import { UiModule } from '@app/ui';

import {ChatComponent} from '@app/modules/chat/chat.component';
import {ChatRoutingModule} from '@app/modules/chat/chat-routing.module';

import {MessagesComponent} from '@app/modules/messages/messages.component';
import {ChatAddComponent} from '@app/modules/chat/chat-add/chat-add.component';

@NgModule({
    imports: [
        UiModule,
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
    declarations: [ChatComponent, MessagesComponent, ChatAddComponent]
})
export class ChatModule { }
