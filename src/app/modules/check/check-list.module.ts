import {NgModule} from '@angular/core';
import {UiModule} from '@app/ui';
import {CheckListComponent} from '@app/modules/check/check-list.component';
import {CheckRoutingModule} from '@app/modules/check/check-routing.module';
import {CheckInfoComponent} from '@app/modules/check/check-info/check-info.component';
import {CheckPayComponent} from '@app/modules/check/check-pay/check-pay.component';

@NgModule({
    imports: [
        UiModule,
        CheckRoutingModule
    ],
    providers: [],
    declarations: [CheckListComponent, CheckInfoComponent, CheckPayComponent]
})
export class CheckListModule { }
