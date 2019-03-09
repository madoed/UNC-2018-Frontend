import {NgModule} from '@angular/core';
import {MeetingRoutingModule} from '@app/modules/meeting/meeting-routing.module';
import {UiModule} from '@app/ui';
import {MatTableModule} from '@angular/material';
import {MeetingCreateComponent} from '@app/modules/meeting/meeting-create/meeting-create.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
    declarations: [MeetingCreateComponent],
    imports: [
        AgmCoreModule.forRoot({apiKey: 'AIzaSyDcf8HCvabHVhKM5nEV1b9wlqfLlQ0XeVU'}),
        MeetingRoutingModule,
        UiModule,
        MatTableModule
    ]
})
export class MeetingCreateModule { }
