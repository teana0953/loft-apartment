import { Mutation } from "vuex";

export interface IState {
    ready: boolean;

    /**
     * pwa install deferred
     */
    installPrompt: any;

    canInstall: boolean;
}

export interface IMutation {
    SET_READY: Mutation<IState>;
    SET_INSTALL_PROMPT: Mutation<IState>;
    SET_CAN_INSTALL: Mutation<IState>
}

export enum EAction {
    SET_READY = 'SET_READY',
    SET_INSTALL_PROMPT = 'SET_INSTALL_PROMPT',
    SET_CAN_INSTALL = 'SET_CAN_INSTALL',
}
