import {NgModule} from '@angular/core';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardRoutingModule} from '@app/modules/card/card-routing.module';
import {UiModule} from '@app/ui';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import { MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {CardService} from '@app/core';
import {CardListModule} from '@app/modules/card/card-list/card-list.module';
import {ChatComponent} from '@app/modules/chat/chat.component';
import {DateAdapter, MatTableModule, NativeDateAdapter} from '@angular/material';
import {MessagesModule} from '@app/modules/messages/messages.module';

@NgModule({
  declarations: [MeetingForOwnerComponent],
  imports: [
    MeetingRoutingModule,
    UiModule,
    MatTableModule
  ]
})
export class MeetingGorOwnerModule { }