import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { UiModule } from '@app/ui';

import {CardRoutingModule} from '../card-routing.module';
import {CardListComponent} from './card-list.component';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';

import {CardPayComponent} from '@app/modules/card/card-pay/card-pay.component';



@NgModule({
    declarations: [CardListComponent,
    CardEditComponent,
    CardPayComponent],
    imports: [
        CardRoutingModule,
        UiModule,
        /*MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        ReactiveFormsModule,
        FormsModule*/
    ]
})
export class CardListModule { }
