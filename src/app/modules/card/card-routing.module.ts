import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/index';
import {CardListComponent} from '@app/modules/card/card-list/card-list.component';
import {CardEditComponent} from '@app/modules/card/card-edit/card-edit.component';
import {CardPayComponent} from '@app/modules/card/card-pay/card-pay.component';

const routes: Routes = [
    {
        path: '',
        component: CardListComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: 'card-add',
        component: CardEditComponent,

        // этот параметр говорит, что только авторизованные пользователи видят эту страницу
        //canActivate: [AuthGuard]
    },
    {
        path: 'pay/:id',
        component: CardPayComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})
export class CardRoutingModule {}
