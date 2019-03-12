import {NgModule} from '@angular/core';
import {UiModule} from '@app/ui';
import {CheckRoutingModule} from '@app/modules/check/check-routing.module';
import {CheckInfoComponent} from '@app/modules/check/check-info/check-info.component';

@NgModule({
    declarations: [CheckInfoComponent],
    imports: [
        CheckRoutingModule,
        UiModule
    ]
})
export class CheckInfoModule { }
