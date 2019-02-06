import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from '@app/auth';
import { CoreModule } from '@app/core';
import { HeaderComponent, SharedModule } from '@app/shared';

import { MapMockInterceptor, UserMockInterceptor }  from '@app/mock';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserModule,
    CoreModule,
    SharedModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    /*HttpClientInMemoryWebApiModule.forRoot(
      UserDataService, { dataEncapsulation: false }
    )*/
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserMockInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MapMockInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
