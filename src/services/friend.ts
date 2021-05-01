import { AxiosService } from '@/helper';
import { ApiHelper } from '.';
import { Observable } from 'rxjs';
import { IResponseBase, IUser } from '@/models';

interface IUrl {
    friend: string;
    friends: string;
}

export interface IAddFriend {
    email: string;
    name?: string;
}

/**
 *
 */
class FriendHelper extends ApiHelper<IUrl> {
    constructor() {
        super();
        this.urls = {
            friend: '/friend',
            friends: '/friends',
        };
    }

    /**
     *
     */
    public getFriends$() {
        return new Observable<IResponseBase<IUser.IFriend[]>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.friends,
                method: 'get',
                headers: this.getAuthHeader(),
            }).subscribe({
                next: (response) => {
                    let data: IResponseBase<IUser.IFriend[]> = response.data;
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
                                email: item?.email,
                                photoUrl: item?.photoUrl,
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
    public addFriend$(data: IAddFriend) {
        return new Observable<IResponseBase<IUser.IFriend>>((observer) => {
            let sub = AxiosService.http$({
                url: this.urls.friend,
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
    public deleteFriend$(id: string) {
        return new Observable<IResponseBase<IUser.IFriend>>((observer) => {
            let sub = AxiosService.http$({
                url: `${this.urls.friend}/${id}`,
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

export const FriendService = new FriendHelper();
