import {Check} from '@app/core/models/check.model';
import {Item} from '@app/core/models/item.model';

export interface ItemAmount {
    id?: number;
    billItemAmount: Item;
    itemAmountCheck:  Check;
    amountInCheck: number;
    name: string;
}
