import {Meeting, User} from '@app/core';
import {Card} from '@app/core/models/card.model';

export interface Bill {
    id?: number;
    billOwner: User[];
    billOfMeeting: Meeting[];
    dateOfBill: number;
    billStatus: string;
    billCommonAmount: number;
    billTotalSum: number;
    mainCard: Card;
}
