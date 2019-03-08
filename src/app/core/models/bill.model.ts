import {Meeting, User} from '@app/core';

export interface Bill {
    id?: number;
    billOwner: User[];
    billOfMeeting: Meeting[];
    dateOfBill: number;
    billStatus: string;
    billCommonAmount: number;
    billTotalSum: number;
}
