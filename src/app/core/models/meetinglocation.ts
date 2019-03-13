import {Meeting, Place, User} from '@app/core';

export interface Meetinglocation {
    id?: number;
    oneLocation: Place;
    locationOfMeeting: Meeting;
    suggesterOfLocation: User;
    voicesForLocation: User[];
    percentageForPlace: number;
}
