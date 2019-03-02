import {Chat, User} from '@app/core';
import {Bill} from '@app/core/models/bill.model';

export interface Item {
    id?: number;
    itemTitle: string;
    itemAmount:  number;
    itemCurrentAmount: number;
    price: User;
    itemBill: Bill[];
}

