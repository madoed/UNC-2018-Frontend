import { NgModule } from '@angular/core';

import { UiModule } from '@app/ui';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [ProfileComponent, ProfileEditComponent, SearchComponent],
  imports: [
    UiModule,
    UserRoutingModule
  ]
})
export class UserModule { }
