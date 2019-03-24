export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    aboutMe: string;
    friends: User[];
    online: boolean;
    lastVisit: Date;
}
