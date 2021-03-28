import { ActionMethod } from 'vuex';
import { EAction } from './modules/service-worker/models';
import { register } from 'register-service-worker';

export const registerServiceWorker: ActionMethod = async ({ commit }) => {
    if (!('serviceWorker' in navigator)) return;

    await new Promise<void>((resolve, reject) => {
        register(`${process.env.BASE_URL}service-worker.js`, {
            ready() {
                console.log('App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB');

                commit(EAction.SET_READY, true);
                return resolve();
            },
            registered() {
                console.log('Service worker has been registered.');
            },
            cached() {
                console.log('Content has been cached for offline use.');
            },
            updatefound() {
                console.log('New content is downloading.');
            },
            updated() {
                console.log('New content is available; please refresh.');
            },
            offline() {
                console.log('No internet connection found. App is running in offline mode.');
            },
            error(error) {
                console.error('Error during service worker registration:', error);
                return reject(error);
            },
        });
    });
};
