import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CheckListComponent} from '@app/modules/check/check-list.component';

const routes: Routes = [
    {
        path: '',
        component: CheckListComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class CheckRoutingModule {}
