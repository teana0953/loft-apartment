import { LocalStorageService } from '@/helper';

export abstract class ApiHelper<T> {
    /**
     * all needed api's url
     */
    protected Url: T = undefined;

    constructor() {}

    /**
     *
     * @returns
     */
    protected getAuthHeader() {
        return {
            authorization: `Bearer ${LocalStorageService.getItem('token')}`,
        };
    }
}
