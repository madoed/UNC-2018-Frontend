import {NgModule} from '@angular/core';
import {CheckRoutingModule} from '@app/modules/check/check-routing.module';
import {UiModule} from '@app/ui';
import {CheckPayComponent} from '@app/modules/check/check-pay/check-pay.component';

@NgModule({
    declarations: [CheckPayComponent],
    imports: [
        CheckRoutingModule,
        UiModule
    ]
})
export class CheckPayModule { }
