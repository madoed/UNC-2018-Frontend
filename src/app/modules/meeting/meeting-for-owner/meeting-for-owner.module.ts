import {NgModule} from '@angular/core';
import {UiModule} from '@app/ui';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import { MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';


@NgModule({
  declarations: [MeetingForOwnerComponent],
  imports: [
    MeetingRoutingModule,
    UiModule
  ]
})
export class MeetingForOwnerModule { }
