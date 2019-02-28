import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth';
import { MapComponent } from './map.component';

const routes: Routes = [
    {
      path: '',
      component: MapComponent,

      // этот параметр говорит, что только авторизованные пользователи видят эту страницу
      //canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MapRoutingModule {}
