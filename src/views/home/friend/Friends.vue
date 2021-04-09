<template>
    <div class="friends">
        <div class="overall d-flex justify-center">
            <span class="mr-auto">Overall, you owe $8,439</span>
            <v-icon @click="addFriend">mdi-account-plus</v-icon>
        </div>

        <add-friend :isShow.sync="showAddFriend"></add-friend>
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
                <v-icon>mdi-playlist-edit</v-icon>
                Add Expense
            </v-btn>
        </v-fab-transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddFriend from './AddFriendDialog.vue';
import { ERouterName, ERouterUrl } from '@/router/model';
import { IFriend } from './model';

@Component({
    components: {
        AddFriend,
    },
})
export default class Friends extends Vue {
    private friends: IFriend[] = [];
    private showAddFriend: boolean = false;

    mounted() {
        this.friends = [
            {
                id: '1',
                name: 'chien fang wang',
                email: 'ddd@dd.cc',
                summaryMoney: 3698,
            },
        ];
    }

    listItemOnClick(event: MouseEvent, friend: IFriend) {
        this.$router.push({
            name: ERouterName.friendDetail,
            params: {
                id: friend.id,
            },
        });
    }

    addFriend() {
        this.showAddFriend = true;
    }

    addExpense() {}
}
</script>

<style lang="scss" scoped>
.friends {
    height: 100%;
    padding: 1rem;

    &__fab {
        bottom: 1.6rem;
    }
}
</style>
