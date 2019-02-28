
import {NgModule} from '@angular/core';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardRoutingModule} from '@app/modules/card/card-routing.module';
import { UiModule } from '@app/ui';
@NgModule({
    declarations: [CardEditComponent],
    imports: [
        CardRoutingModule,
        UiModule,
        /*MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule*/
    ]
})
export class CardEditModule { }
