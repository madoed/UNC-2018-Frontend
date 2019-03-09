import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { MapRoutingModule } from './map-routing.module';
import { UiModule } from '@app/ui';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    //AgmCoreModule.forRoot({apiKey: 'AIzaSyDcf8HCvabHVhKM5nEV1b9wlqfLlQ0XeVU'}),
    MapRoutingModule,
    UiModule
  ]
})
export class MapModule { }
