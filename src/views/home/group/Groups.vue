<template>
    <div class="groups">
        <user-overall
            :showAddGroup="true"
            :friends="friends"
        ></user-overall>

        <loading v-show="isLoading"></loading>
        <v-snackbar
            :timeout="5000"
            v-model="isShowError"
            absolute
            bottom
            color="error"
            left
            text
        >
            {{ errorMsg }}
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ERouterName, ERouterUrl } from '@/router/model';
import { IFriend } from './model';

import UserOverall from '../../../components/user-overall';
import Loading from '../../../components/Loading.vue';
import { Subscription } from 'rxjs';
import { FriendService } from '@/services';

@Component({
    components: {
        Loading,
        UserOverall,
    },
})
export default class Groups extends Vue {
    private friends: IFriend[] = [];

    private isLoading: boolean = false;

    private errorMsg: string = '';
    private isShowError: boolean = false;

    private subscriptions: Subscription = new Subscription();

    mounted() {
        this.getFriends();
    }

    destroyed() {
        if (!this.subscriptions.closed) {
            this.subscriptions.unsubscribe();
        }
    }

    getFriends(): void {
        this.subscriptions.add(
            FriendService.getFriends$().subscribe({
                next: (result) => {
                    this.friends = result.data;
                },
                error: (err) => {
                    this.showError(err);
                },
            }),
        );
    }

    listItemOnClick(event: MouseEvent, friend: IFriend) {
        this.$router.push({
            name: ERouterName.friendDetail,
            params: {
                id: friend.id,
            },
        });
    }

    showError(error) {
        this.isShowError = true;
        this.errorMsg = error.message;
    }
}
</script>

<style lang="scss" scoped>
.groups {
    height: 100%;
    padding: 1rem;

    &__fab {
        bottom: 2.5rem;
    }
}
</style>
