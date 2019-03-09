import {NgModule} from '@angular/core';
import { UiModule } from '@app/ui';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {MeetingListComponent} from '@app/modules/meeting/meeting-list.component';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import {MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {MeetingCreateComponent} from '@app/modules/meeting/meeting-create/meeting-create.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    UiModule,
    MeetingRoutingModule
  ],
  providers: [],
  declarations: [MeetingListComponent, MeetingForOwnerComponent, MeetingCreateComponent ]
})
export class MeetingListModule { }
