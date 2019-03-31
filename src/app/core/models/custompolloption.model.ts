import {User} from '@app/core';

export interface CustomPollOption {
    id?: number;
    suggesterOfOption: User;
    voicesForOption: User[];
    option: string;
    percentageForOption: number;
}
