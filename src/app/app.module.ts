import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
<<<<<<< HEAD
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CardService} from './service/card/card.service';
import {CardListComponent} from './card/card-list/card-list.component';
import {MatButtonModule, MatCardModule, MatInputModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CardEditComponent } from './card/card-edit/card-edit.component';
import { CardPayComponent } from './card/card-pay/card-pay.component';
import { MapComponent } from './map/map.component';
import {AgmCoreModule} from '@agm/core';
import {MapService} from './service/map/map.service';
import { ChatComponent } from './chat/chat.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/card-list', pathMatch: 'full' },
    {
        path: 'card-list',
        component: CardListComponent
    },
    {
        path: 'card-add',
        component: CardEditComponent
    },
    {
        path: 'pay/:id',
        component: CardPayComponent
    },
    {
        path: 'map',
        component: MapComponent
    },
    {
        path: 'socket',
        component: ChatComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
      CardListComponent,
      CardEditComponent,
      CardPayComponent,
      MapComponent,
      ChatComponent
=======
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from '@app/auth';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { MapMockInterceptor, UserMockInterceptor } from '@app/mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    AppComponent
>>>>>>> b74b8b5e2540f79276853b25087ad8c9f887333d
  ],
  imports: [
      AppRoutingModule,
      AuthModule,
      CoreModule,
      SharedModule,
      BrowserAnimationsModule,
<<<<<<< HEAD
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatListModule,
      MatToolbarModule,
      ReactiveFormsModule,
      FormsModule,
      MatSidenavModule,
      RouterModule.forRoot(appRoutes),
      AgmCoreModule.forRoot({apiKey: 'AIzaSyCkJWTDYq8r38CZGt0CmoXxBRLUR5jkrd4'})
=======
      BrowserModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UserMockInterceptor, multi: true },
      /*{ provide: HTTP_INTERCEPTORS, useClass: MapMockInterceptor, multi: true }*/
>>>>>>> b74b8b5e2540f79276853b25087ad8c9f887333d
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
