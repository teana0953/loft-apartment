import { ActionTree, MutationTree } from 'vuex';
import { EAction, IMutation, IState } from './models';

const state: IState = {
    ready: false,
    canInstall: false,
    installPrompt: undefined,
};

const mutations: MutationTree<IState> = {
    SET_READY(state, ready: boolean) {
        state.ready = ready;
    },
    SET_CAN_INSTALL(state, canInstall: boolean) {
        state.canInstall = canInstall;
    },
    SET_INSTALL_PROMPT(state, deffered: any) {
        state.installPrompt = deffered;
    },
};

const actions: ActionTree<{}, {}> = {
    setReady({ commit }, ready: boolean) {
        commit(EAction.SET_READY, ready);
    },
    setCanInstall({ commit }, canInstall: boolean) {
        commit(EAction.SET_CAN_INSTALL, canInstall);
    },
    setInstallPrompt({ commit }, deffered: any) {
        commit(EAction.SET_INSTALL_PROMPT, deffered);
    },
};

const getters = {
    ready(state: IState) {
        return state.ready;
    },
    canInstall(state: IState) {
        return state.canInstall;
    },
    installPrompt(state: IState) {
        return state.installPrompt;
    },
};

export default {
    state,
    mutations,
    actions,
    getters,
};

export * as IServiceWorker from './_index';
