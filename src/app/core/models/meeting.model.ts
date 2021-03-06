import {Place, User} from '@app/core';
import {Chat} from '@app/core/models/chat.model';



export interface Meeting {
  id?: number;
  meetingName: string;
  meetingDescription?:  string;
  meetingLocation: Place;
  boss: User;
  dateOfMeeting: number;
  status: string;
  meetingChat: Chat;
  name: string;
  amountOfParticipants: number;
  timeOfMeeting: Date;
  pollForPlaceOpen: number;
  pollForDateOpen: number;
  avatarUrl: string;
  meetingType: string;
  recursiveInfo: number;
}
