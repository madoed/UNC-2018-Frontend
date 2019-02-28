import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '@app/shared';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    AgmCoreModule.forRoot({apiKey: 'key'}),
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
