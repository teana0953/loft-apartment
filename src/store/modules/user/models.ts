import { Mutation } from "vuex";

export interface IUser {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: string;
}

export interface IMutation {
    SET_USER: Mutation<IUser>;
}

export enum EAction {
    SET_READY = 'SET_READY',
    SET_INSTALL_PROMPT = 'SET_INSTALL_PROMPT',
    SET_CAN_INSTALL = 'SET_CAN_INSTALL',
}
