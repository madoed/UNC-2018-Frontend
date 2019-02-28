import {NgModule} from '@angular/core';
import {CardRoutingModule} from '@app/modules/card/card-routing.module';
import {SharedModule} from '@app/shared';
import {ChatAddComponent} from '@app/modules/chat/chat-add/chat-add.component';

@NgModule({
    declarations: [ChatAddComponent],
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
export class ChatAddModule { }
