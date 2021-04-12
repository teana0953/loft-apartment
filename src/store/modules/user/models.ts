import { Mutation } from 'vuex';

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
    photoUrl?: string;
}
