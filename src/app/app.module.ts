import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
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
    }
];

@NgModule({
  declarations: [
    AppComponent,
      CardListComponent,
      CardEditComponent,
      CardPayComponent,
      MapComponent
  ],
  imports: [
    BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatListModule,
      MatToolbarModule,
      ReactiveFormsModule,
      FormsModule,
      MatSidenavModule,
      RouterModule.forRoot(appRoutes),
      AgmCoreModule.forRoot({apiKey: 'key'})
  ],
  providers: [CardService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
