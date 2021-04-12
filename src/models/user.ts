import { IUser as User } from '../store/modules/user';
export interface IUser extends User.IUser {}

export interface IFriend {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
}
