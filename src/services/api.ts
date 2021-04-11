import { LocalStorageService } from '@/helper';

export abstract class ApiHelper {
    /**
     * all needed api's url
     */
    protected Url: {
        [x: string]: string;
    } = {};

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
