import { Server } from '../server';

/**
 *
 */
class FriendHelper {
    /**
     *
     */
    public async getFriends() {
        let result = await Server.get(FriendHelper.EUrl.getFriend);

        return result.data;
    }
}

namespace FriendHelper {
    export enum EUrl {
        addFriend = '/user/add-friend',
        getFriend = '/user/friends',
    }
}

export const FriendService = new FriendHelper();
