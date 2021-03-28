import './data-center';

import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';

import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    modules: {
        user,
    },
});

export * from './models';
