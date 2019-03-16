import {Message, User} from '@app/core';

export interface Chat {
    id?: number;
    chatName?: string;
    subscribers:  User[];
    chatType: string;
    lastMessage: string;
    lastSender: User;
    lastUpdate: number;
}
