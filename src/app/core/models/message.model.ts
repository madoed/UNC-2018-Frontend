import {Chat} from '@app/core/models/chat.model';
import {User} from '@app/core';

export interface Message {
    id?: number;
    content: string;
    timestamp?:  number;
    from_chat: Chat;
    sender: User;
}