import { AxiosService } from '@/helper';
import { ApiHelper } from '.';
import { Observable } from 'rxjs';
import { IResponseBase, IUser } from '@/models';

interface IUrl {
    addFriend: string;
    getFriends: string;
}

/**
 *
 */
class FriendHelper extends ApiHelper<IUrl> {
    constructor() {
        super();
        this.Url = {
            addFriend: '/user/add-friend',
            getFriends: '/user/friends',
        };
    }

    /**
     *
     */
    public getFriends$() {
        return new Observable<IResponseBase<IUser.IFriend[]>>((observer) => {
            let sub = AxiosService.http$({
                url: this.Url.getFriends,
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
}

export const FriendService = new FriendHelper();
