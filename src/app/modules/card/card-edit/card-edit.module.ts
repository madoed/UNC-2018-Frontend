
import {NgModule} from '@angular/core';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardRoutingModule} from '@app/modules/card/card-routing.module';
import {SharedModule} from '@app/shared';
import {MatButtonModule, MatCardModule, MatInputModule, MatListModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [CardEditComponent],
    imports: [
        CardRoutingModule,
        SharedModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class CardEditModule { }
