import {NgModule} from '@angular/core';
import {MeetingForOwnerComponent} from '@app/modules/meeting/meeting-for-owner/meeting-for-owner.component';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import {UiModule} from '@app/ui';
import {MeetingForParticipantComponent} from '@app/modules/meeting/meeting-for-participant/meeting-for-participant.component';

@NgModule({
    declarations: [MeetingForParticipantComponent],
    imports: [
        MeetingRoutingModule,
        UiModule
    ]
})
export class MeetingForParticipantModule { }