import { LocalStorageService, ServiceWorkerService } from '../helper';
import * as Rx from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

class Service {
    private _ready$: Rx.BehaviorSubject<boolean> = new Rx.BehaviorSubject<boolean>(false);
    public get ready$(): Rx.BehaviorSubject<boolean> {
        return this._ready$;
    }

    private _installPrompt$: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject<any>(undefined);
    public get installPrompt$(): Rx.BehaviorSubject<any> {
        return this._installPrompt$;
    }

    private _isSupportNotification: boolean = false;
    public get isSupportNotification(): boolean {
        return this._isSupportNotification;
    }

    private _isNotificationOn: boolean = false;
    public get isNotificationOn(): boolean {
        return this._isNotificationOn;
    }

    private _initiation$: Rx.Subject<any> = new Rx.Subject();

    constructor() {
        this._initiation$
            .pipe(
                concatMap(async () => {
                    try {
                        await this.Initiation();

                        this.ready$.next(true);
                    } catch (error) {
                        console.log(error);
                    }
                }),
            )
            .subscribe();

        this._initiation$.next();
    }

    private async Initiation(): Promise<void> {
        /// get current setting
        this._isNotificationOn = !!LocalStorageService.getItem('isNotificationOn');

        /// pwa related
        if (!ServiceWorkerService.isSupportServiceWorker) return;

        this._installPrompt$ = ServiceWorkerService.installPrompt$;
        this._isSupportNotification = ServiceWorkerService.isSupportNotification;

        try {
            await ServiceWorkerService.RegisterServiceWorker();
        } catch (error) {
            throw error;
        }
    }

    public async SetNotification(value: boolean) {
        this._isNotificationOn = value;
        LocalStorageService.setItem('isNotificationOn', value);
        await this.ConfigurePushSub();
    }

    private async ConfigurePushSub(): Promise<void> {
        let subId: string = LocalStorageService.getItem('subscriptionId');
        if (this.isSupportNotification && this.isNotificationOn) {
            try {
                subId = await ServiceWorkerService.ConfigurePushSub();
                if (!!subId) {
                    LocalStorageService.setItem('subscriptionId', subId);
                }
            } catch (error) {
                ServiceWorkerService.notificationPermission$.subscribe({
                    next: async (x) => {
                        if (x === 'granted') {
                            subId = await ServiceWorkerService.ConfigurePushSub();
                            if (!!subId) {
                                LocalStorageService.setItem('subscriptionId', subId);
                            }
                        }
                    },
                });
            }
        } else {
            LocalStorageService.removeItem('subscriptionId');
            await ServiceWorkerService.UnsubscribePush(subId);
        }
    }
}

export default new Service();
