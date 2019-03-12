import {Meeting, User} from '@app/core';

export interface DatePoll {
    id?: number;
    oneDateOfMeeting: Meeting;
    suggesterOfDate: User;
    voicesForDate: User[];
    dateOption: Date;
}
