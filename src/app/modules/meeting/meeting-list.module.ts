import {NgModule} from '@angular/core';
import { UiModule } from '@app/ui';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {MeetingListComponent} from '@app/modules/meeting/meeting-list.component';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import {MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {MessagesModule} from '@app/modules/messages/messages.module';
import {MessageService} from '@app/core/services/message.service';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {ChatComponent} from '@app/modules/chat/chat.component';
import {ChatModule} from '@app/modules/chat/chat.module';
import {MatTableModule} from '@angular/material';

@NgModule({
  imports: [
    UiModule,
    MeetingRoutingModule
  ],
  providers: [],
  declarations: [MeetingListComponent, MeetingForOwnerComponent ]
})
export class MeetingListModule { }
