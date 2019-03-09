import {User} from '@app/core';
import {Meeting} from '@app/core/models/meeting.model';

export interface Participant {
  id?: number;
  meetingParticipant: User;
  suggestedLocations?:  Location;
  participantOfMeeting: Meeting;
  statusOfConfirmation: string;
}