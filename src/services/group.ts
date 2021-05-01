import { AxiosService } from '@/helper';
import { ApiHelper } from '.';
import { Observable } from 'rxjs';
import { IResponseBase, IUser } from '@/models';

interface IUrl {
    group: string;
    groups: string;
}

export interface ICreateGroup {
    name: string;
    userIds: string[];
}

export interface IGroup {
    id: string;
    name: string;
    userIds: string[];
    createdUserId: string;
}

/**
 *
 */
class GroupHelper extends ApiHelper<IUrl> {
    constructor() {
        super();
        this.urls = {
            group: '/group',
            groups: '/groups',
        };
    }

    /**
     * Get groups
     */
    public getGroups$() {
        return new Observable<IResponseBase<IGroup[]>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.groups,
                method: 'get',
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IGroup[]> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    observer.next({
                        status: data.status,
                        limit: data.limit,
                        page: data.page,
                        total: data.total,
                        data: (data.data || []).map((item) => {
                            return {
                                id: item?.id,
                                name: item?.name,
                                userIds: item?.userIds || [],
                                createdUserId: item?.createdUserId,
                            };
                        }),
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     *
     * @param data
     * @returns
     */
    public addGroup$(data: ICreateGroup) {
        return new Observable<IResponseBase<IUser.IFriend>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.group,
                method: 'post',
                data: data,
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IFriend> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    let user = data.data;

                    observer.next({
                        status: data.status,
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            photoUrl: user.photoUrl,
                        },
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                },
            });

            return () => sub.unsubscribe();
        });
    }

    /**
     *
     * @param id
     * @returns
     */
    public deleteGroup$(id: string) {
        return new Observable<IResponseBase<IUser.IFriend>>((observer) => {
            let sub = AxiosService.http$({
                url: `${this.urls.group}/${id}`,
                method: 'delete',
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IFriend> = response.data;
                    if (!data) {
                        observer.error('no any data');
                    }

                    let user = data.data;

                    observer.next({
                        status: data.status,
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            photoUrl: user.photoUrl,
                        },
                    });
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                },
            });

            return () => sub.unsubscribe();
        });
    }
}

export const GroupService = new GroupHelper();
