enum ELocalStorageKeys {
    isNotificationOn = 'isNotificationOn',
    subscriptionId = 'subscriptionId',
    user = 'user',
    token = 'token',
}

export type TLocalStorageKeys = keyof typeof ELocalStorageKeys;

export class LocalStorageHelper {
    /**
     *
     * @param key
     * @returns
     */
    public getItem(key: TLocalStorageKeys) {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     *
     * @param key
     * @param value
     */
    public setItem(key: TLocalStorageKeys, value: any) {
        try {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param key
     * @param value
     */
    public removeItem(key: TLocalStorageKeys) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            throw error;
        }
    }
}
