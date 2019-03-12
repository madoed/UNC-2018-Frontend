import {NgModule} from '@angular/core';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import {UiModule} from '@app/ui';
import {MatTableModule} from '@angular/material';
import {MeetingCreateComponent} from '@app/modules/meeting/meeting-create/meeting-create.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
    declarations: [MeetingCreateComponent],
    imports: [
        AgmCoreModule.forRoot({apiKey: 'AIzaSyC6X_mvHMbSepVxvX58yWDT52idpQ9iduI'}),
        MeetingRoutingModule,
        UiModule,
        MatTableModule
    ]
})
export class MeetingCreateModule { }
