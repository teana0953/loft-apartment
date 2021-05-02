<template>
    <div class="friends">
        <user-overall
            :showAddFriend="true"
            @add-friend="addFriend"
            @error="showError"
        ></user-overall>

        <v-list three-line>
            <template v-for="(friend, index) in friends">
                <v-list-item :key="friend.id">
                    <v-list-item-avatar>
                        <v-icon
                            v-if="!friend.photoUrl"
                            class="grey lighten-1"
                            dark
                        >
                            mdi-account
                        </v-icon>
                        <v-img
                            v-if="friend.photoUrl"
                            :src="baseUrl + '/' + friend.photoUrl"
                        ></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title v-html="friend.name"></v-list-item-title>
                        <v-list-item-subtitle v-html="friend.email"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-icon @click="gotoDetail($event, friend)">
                            mdi-view-list
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                        <v-icon @click="showDeleteFriend($event, friend.id)">
                            mdi-delete
                        </v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-divider
                    :key="index"
                    :inset="true"
                ></v-divider>
            </template>
        </v-list>

        <delete-friend
            :isShow.sync="isShowDeleteFriend"
            @confirm="deleteFriend"
        ></delete-friend>

        <expense-dialog
            :isShow.sync="isShowExpense"
            :friends="friends"
        ></expense-dialog>
        <v-fab-transition>
            <v-btn
                class="friends__fab"
                color="primary"
                dark
                absolute
                right
                rounded
                @click="addExpense"
            >
                <v-icon>mdi-playlist-plus</v-icon>
                Add Expense
            </v-btn>
        </v-fab-transition>

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

        <loading v-show="isLoading"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import UserOverall from '../../../components/user-overall';
import DeleteFriend from './DeleteFriendDialog.vue';
import ExpenseDialog from '../../../components/expense';
import Loading from '../../../components/Loading.vue';

import { ERouterName, ERouterUrl } from '@/router/model';
import { IFriend } from './model';
import { IUser } from '@/store/modules/user/models';
import { baseUrl } from '@/server';
import { FriendService } from '../../../services';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    components: {
        Loading,
        UserOverall,
        DeleteFriend,
        ExpenseDialog,
    },
})
export default class Friends extends Vue {
    private user: IUser = this.$store.getters.user;
    private readonly baseUrl: string = baseUrl;

    private friends = [];

    private errorMsg: string = '';
    private isShowError: boolean = false;

    private isShowDeleteFriend: boolean = false;
    private deleteFriendId: string = '';

    private isShowExpense: boolean = false;

    private isLoading: boolean = false;

    private subscriptions: Subscription = new Subscription();

    async created() {
        this.getFriends();
    }

    mounted() {
        console.log(this.friends);
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

    addFriend(value) {
        console.log(value);
        // refresh
        this.getFriends();
    }

    showDeleteFriend(event, id: string) {
        this.isShowDeleteFriend = true;
        this.deleteFriendId = id;
    }

    deleteFriend() {
        this.isLoading = true;
        this.subscriptions.add(
            FriendService.deleteFriend$(this.deleteFriendId)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                        this.deleteFriendId = '';
                    }),
                )
                .subscribe({
                    next: (result) => {
                        this.getFriends();
                    },
                    error: (err) => {
                        this.showError(err);
                    },
                }),
        );
    }

    gotoDetail(event, friend) {
        console.log(friend);
    }

    addExpense() {
        this.isShowExpense = true;
    }

    showError(error) {
        this.isShowError = true;
        this.errorMsg = error.message;
    }
}
</script>

<style lang="scss" scoped>
.friends {
    height: 100%;
    padding: 1rem;

    &__fab {
        bottom: 2.5rem;
    }
}
</style>
