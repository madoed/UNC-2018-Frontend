import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CheckListComponent} from '@app/modules/check/check-list.component';
import {CheckInfoComponent} from '@app/modules/check/check-info/check-info.component';
import {CheckPayComponent} from '@app/modules/check/check-pay/check-pay.component';

const routes: Routes = [
    {
        path: '',
        component: CheckListComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: 'check-info/:id',
        component: CheckInfoComponent,
    },
    {
        path: 'check-pay/:id',
        component: CheckPayComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class CheckRoutingModule {}
