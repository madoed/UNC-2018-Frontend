export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    aboutMe: string;
    friends: User[];
    online: boolean;
}
