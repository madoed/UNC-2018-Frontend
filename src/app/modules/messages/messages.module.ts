import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';
import {MessagesComponent} from '@app/modules/messages/messages.component';
import {NgxAutoScrollModule} from 'ngx-auto-scroll';
import {
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule
} from '@angular/material';
import {RouterModule} from '@angular/router';

//import { StompService } from 'ng2-stomp-service';

@NgModule({
    imports: [
        SharedModule,
        /*MatGridListModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatSnackBarModule,
        MatCardModule,
        NgxAutoScrollModule*/
    ],
    declarations: [MessagesComponent]
})
export class MessagesModule { }