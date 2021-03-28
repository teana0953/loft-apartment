import * as Rx from 'rxjs';
import { register } from 'register-service-worker';
import { AxiosResponse } from 'axios';
import { Server } from '../server';

export class ServiceWorkerHelper {
    private _isSupportServiceWorker: boolean = false;
    public get isSupportServiceWorker(): boolean {
        return this._isSupportServiceWorker;
    }

    /**
     * install prompt
     */
    private _installPrompt$: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject<any>(undefined);
    public get installPrompt$(): Rx.BehaviorSubject<any> {
        return this._installPrompt$;
    }

    /**
     * whether is support notification
     */
    private _isSupportNotification: boolean = false;
    public get isSupportNotification(): boolean {
        return this._isSupportNotification;
    }

    /**
     * whether app is already subscribe push
     */
    private _isPushSubscribed$: Rx.BehaviorSubject<boolean> = new Rx.BehaviorSubject<boolean>(false);
    public get isPushSubscribed$(): Rx.BehaviorSubject<boolean> {
        return this._isPushSubscribed$;
    }

    /**
     * service worker file path
     */
    public serviceWorkerPath: string = `${process.env.BASE_URL}service-worker.js`;

    private _notificationStatus: PermissionStatus = undefined;
    public notificationPermission$: Rx.BehaviorSubject<PermissionState> = new Rx.BehaviorSubject<PermissionState>(undefined);

    private _initiation$: Rx.Subject<any> = new Rx.Subject();

    constructor() {
        this._isSupportServiceWorker = this.CheckSupportServiceWorker();
        if (!this._isSupportServiceWorker) return;

        window.addEventListener('appinstalled', (event) => {
            console.log('👍', 'appinstalled', event);
            this._installPrompt$.next(undefined);
        });

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Stash the event so it can be triggered later.
            this._installPrompt$.next(e);
        });

        this._isSupportNotification = this.CheckSupportNotification();

        this._initiation$.subscribe({
            next: async () => {
                try {
                    this.Initiation();
                } catch (error) {
                    console.error(error);
                }
            },
        });

        this._initiation$.next();
    }

    private async Initiation(): Promise<void> {
        if (!this.isSupportServiceWorker) return;

        let pushSubsciption = this.GetPushSubscription();
        if (pushSubsciption) this._isPushSubscribed$.next(true);
    }

    private CheckSupportServiceWorker(): boolean {
        return 'serviceWorker' in navigator;
    }

    private CheckSupportNotification(): boolean {
        return 'Notification' in window;
    }

    /**
     * Register Service Worker
     */
    public async RegisterServiceWorker(): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                register(`${process.env.BASE_URL}service-worker.js`, {
                    registrationOptions: {
                        scope: `${process.env.BASE_URL}`,
                    },
                    ready() {
                        console.log('App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB');

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
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     */
    public async ConfigurePushSub(): Promise<string> {
        try {
            let pushSubscription: PushSubscription = await this.GetPushSubscription();
            let subId: string = '';

            if (!this._notificationStatus) {
                this._notificationStatus = await this.GetNotificationPermission();
                this._notificationStatus.onchange = (event) => {
                    this.OnNotificationPermissionChange(event);
                };
            }

            if (pushSubscription === null) {
                /// check notification permission
                let notificationPermission = this._notificationStatus.state;
                if (notificationPermission === 'denied') {
                    throw 'please give notification permission';
                }

                // Create a new subscription
                subId = await this.SubscribePush();
            } else {
                // We have a subscription
                this._isPushSubscribed$.next(true);
            }

            return subId;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @returns
     */
    private async GetPushSubscription(): Promise<PushSubscription> {
        let serviceWorkerRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.ready;

        let pushSubscription: PushSubscription = await serviceWorkerRegistration.pushManager.getSubscription();
        return pushSubscription;
    }

    /**
     *
     */
    private async SubscribePush(): Promise<string> {
        let serviceWorkerRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.ready;

        let vapidPublicKey = 'BKZhA9PNR_2rWvXkXhPqW24DCOs87MXlMUX468u0FtTkNuejUvZ1gBqr4L9TBwPBWo5TvG7aCRbMnT7SkyfjV5Q';
        let convertedVapidPublicKey = this.UrlBase64ToUint8Array(vapidPublicKey);

        let newPushSubscription: PushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey,
        });

        let response: AxiosResponse = undefined;
        try {
            response = await Server.post('/subscribe', JSON.stringify(newPushSubscription), {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('subscription ok!', response.data);
                this._isPushSubscribed$.next(true);
                return response.data.objectId;
            }

            return '';
        } catch (error) {
            await newPushSubscription.unsubscribe();
        }
    }

    public async UnsubscribePush(id: string): Promise<void> {
        try {
            let pushSub = await this.GetPushSubscription();

            if (!!pushSub) {
                pushSub.unsubscribe();
            }

            let response: AxiosResponse = undefined;
            try {
                response = await Server.post('/unsubscribe', JSON.stringify({ id: id }), {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });

                if (response.status === 200) {
                    console.log('unsubscription ok!', response.data);
                    this._isPushSubscribed$.next(false);
                }
            } catch (error) {
                console.log('unsubscribe', error);
            }
        } catch (error) {
            throw error;
        }
    }

    public async GetServiceWorkerSub(): Promise<ServiceWorkerRegistration> {
        let serviceWorkerRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.ready;
        return serviceWorkerRegistration;
    }

    /**
     *
     * @returns
     */
    public async GetNotificationPermission(): Promise<PermissionStatus> {
        let result = await window.navigator.permissions.query({ name: 'notifications' });
        return result;
    }

    /**
     *
     * @param event
     */
    private OnNotificationPermissionChange(event: any): void {
        this.notificationPermission$.next(event.currentTarget.state);
    }

    /**
     *
     * @param base64String
     * @returns
     */
    private UrlBase64ToUint8Array(base64String): Uint8Array {
        let padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        let base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        let rawData = window.atob(base64);
        let outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}
