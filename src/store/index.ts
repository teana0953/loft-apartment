import './data-center';

import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';

import serviceWorker from './modules/service-worker';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    modules: {
        serviceWorker,
    },
});

export * from './models';
