import {Participant} from '@app/core';

export interface Check {
    id?: number;
    checkOwner: Participant;
    checkAmount:  number;
    checkStatus: string;
    name: string;
}
