import {User} from '@app/core';

export interface Chat {
    id?: number;
    chatName?: string;
    subscribers:  User[];
}