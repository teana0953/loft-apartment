<template>
    <div class="groups">
        <user-overall
            :showAddGroup="true"
            :friends="friends"
        ></user-overall>

        <v-list three-line>
            <template v-for="(group, index) in groups">
                <v-list-item :key="group.id">
                    <v-list-item-avatar size="62">
                        <v-icon
                            class="orange lighten-1"
                            dark
                        >
                            mdi-account-group-outline
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title v-html="group.name"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-icon @click="gotoDetail($event, group)">
                            mdi-view-list
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                        <v-icon @click="showDeleteGroup($event, group.id)">
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

        <delete-group
            :isShow.sync="isShowDeleteGroup"
            @confirm="deleteGroup"
        ></delete-group>

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
import DeleteGroup from './DeleteGroupDialog.vue';

import Loading from '../../../components/Loading.vue';
import { Subscription } from 'rxjs';
import { FriendService, GroupService, IGroup } from '@/services';
import { finalize } from 'rxjs/operators';

@Component({
    components: {
        Loading,
        UserOverall,
        DeleteGroup,
    },
})
export default class Groups extends Vue {
    private groups: IGroup[] = [];
    private friends: IFriend[] = [];

    private isShowDeleteGroup: boolean = false;
    private deleteGroupId: string = '';

    private isLoading: boolean = false;

    private errorMsg: string = '';
    private isShowError: boolean = false;

    private subscriptions: Subscription = new Subscription();

    mounted() {
        this.getGroups();
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

    getGroups(): void {
        this.subscriptions.add(
            GroupService.getGroups$().subscribe({
                next: (result) => {
                    this.groups = result.data;
                },
                error: (err) => {
                    this.showError(err);
                },
            }),
        );
    }

    showDeleteGroup(event, id: string) {
        this.isShowDeleteGroup = true;
        this.deleteGroupId = id;
    }

    deleteGroup() {
        this.isLoading = true;
        this.subscriptions.add(
            GroupService.deleteGroup$(this.deleteGroupId)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                        this.deleteGroupId = '';
                    }),
                )
                .subscribe({
                    next: (result) => {
                        this.getGroups();
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
