import { ActionTree, MutationTree } from 'vuex';
import { EAction, IMutation, IUser } from './models';

const state: IUser = {
    id: "",
    name: "",
    email: "",
    role: "",
    photo: ""
};

const mutations: MutationTree<IUser> = {
    SET_USER(state, user: IUser) {
        state.id = user.id;
        state.name = user.name;
        state.email = user.email;
        state.photo = user.photo;
        state.role = user.role;
    },
};

const actions: ActionTree<MutationTree<IUser>, IUser> = {
    setUser({ commit }, user: IUser) {
        commit('SET_USER', user);
    }
};

const getters = {
    user(state: IUser): IUser {
        return {
            id: state.id,
            name: state.name,
            email: state.email,
            photo: state.photo,
            role: state.role
        }
    }
};

export default {
    state,
    mutations,
    actions,
    getters,
};

export * as IUser from './_index';
