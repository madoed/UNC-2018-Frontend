import { NgModule } from '@angular/core';

import { UiModule } from '@app/ui';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    UiModule,
    UserRoutingModule
  ]
})
export class UserModule { }
