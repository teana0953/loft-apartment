<template>
    <div class="friends">
        <div class="overall d-flex justify-center">
            <span class="mr-auto">Overall, you owe $8,439</span>
            <v-icon @click="showAddFriend">mdi-account-plus</v-icon>
        </div>

        <v-list three-line>
            <template v-for="(friend, index) in friends">
                <v-list-item
                    :key="friend.id"
                    @click="gotoDetail($event, friend)"
                >
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
                </v-list-item>
                <v-divider
                    :key="index"
                    :inset="true"
                ></v-divider>
            </template>
        </v-list>

        <add-friend
            :isShow.sync="isShowAddFriend"
            @add-friend="addFriend"
            @error="showError"
        ></add-friend>

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
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddFriend from './AddFriendDialog.vue';
import ExpenseDialog from '../ExpenseDialog.vue';

import { ERouterName, ERouterUrl } from '@/router/model';
import { IFriend } from './model';
import { IUser } from '@/store/modules/user/models';
import { baseUrl } from '@/server';
import { FriendService } from '../../../services';
import { Subscription } from 'rxjs';

@Component({
    components: {
        AddFriend,
        ExpenseDialog,
    },
})
export default class Friends extends Vue {
    private user: IUser = this.$store.getters.user;
    private readonly baseUrl: string = baseUrl;

    private friends = [];

    private isShowAddFriend: boolean = false;
    private errorMsg: string = '';
    private isShowError: boolean = false;

    private isShowExpense: boolean = false;

    private subscriptions: Subscription = new Subscription();

    async created() {
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

    mounted() {
        console.log(this.friends);
    }

    destroyed() {
        if (!this.subscriptions.closed) {
            this.subscriptions.unsubscribe();
        }
    }

    listItemOnClick(event: MouseEvent, friend: IFriend) {
        this.$router.push({
            name: ERouterName.friendDetail,
            params: {
                id: friend.id,
            },
        });
    }

    showAddFriend() {
        this.isShowAddFriend = true;
    }

    addFriend(friend) {
        console.log(friend);
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
