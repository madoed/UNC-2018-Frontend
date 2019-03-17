import { NgModule } from '@angular/core';
import { UiModule } from '@app/ui';
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
import {VirtualScrollerModule} from 'primeng/virtualscroller';

//import { StompService } from 'ng2-stomp-service';

@NgModule({
    imports: [
        UiModule
    ],
    declarations: [MessagesComponent]
})
export class MessagesModule { }
