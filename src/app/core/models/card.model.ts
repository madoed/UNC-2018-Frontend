import {Meeting, User} from '@app/core';

export interface Card {
    id?: number;
    nameSurname: string;
    lastFourNumbers: string;
    dataOfExpire: string;
    owner: User;
}
