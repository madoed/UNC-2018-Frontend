import { Role } from './role.model';

export interface User {
    id: number;
    username: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    aboutMe: string;
    friends: User[];
}
