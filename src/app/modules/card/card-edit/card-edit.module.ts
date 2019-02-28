
import {NgModule} from '@angular/core';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardRoutingModule} from '@app/modules/card/card-routing.module';
import {SharedModule} from '@app/shared';
@NgModule({
    declarations: [CardEditComponent],
    imports: [
        CardRoutingModule,
        SharedModule,
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
