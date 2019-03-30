import {Meeting, User} from '@app/core';
import {CustomPollOption} from '@app/core/models/custompolloption.model';

export interface CustomPoll {
    id?: number;
    pollOfMeeting: Meeting;
    customPollName: string;
    isOpened: number;
    optionsInPoll: CustomPollOption[];
    creatorOfPoll: User;
}
