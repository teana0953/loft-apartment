<template>
    <div class="friends">
        <add-friend :isShow.sync="showAddFriend"></add-friend>
        <v-fab-transition>
            <v-btn
                class="friends__fab"
                color="primary"
                dark
                absolute
                right
                fab
                @click="addFriend"
            >
                <v-icon>mdi-plus</v-icon>
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
        AddFriend
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
}
</script>

<style lang="scss" scoped>
.friends {
    height: 100%;

    &__fab {
        bottom: 1.6rem;
    }
}
</style>
