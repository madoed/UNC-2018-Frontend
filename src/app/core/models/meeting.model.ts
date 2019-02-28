import {User} from '@app/core';
import {Chat} from '@app/core/models/chat.model';

export interface Meeting {
  id?: number;
  meetingName: string;
  meetingDescription?:  string;
  place: Location;
  boss: User;
  dateOfMeeting: Date;
  status: string;
  meetingChat: Chat;
  name: string;
}