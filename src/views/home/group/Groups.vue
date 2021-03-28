<template>
    <div class="groups">
        groups
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ERouterName, ERouterUrl } from '@/router/model';
import { IFriend } from './model';

@Component({
    components: {
    },
})
export default class Groups extends Vue {
    private friends: IFriend[] = [];

    mounted() {
        this.friends = [
            {
                id: '1',
                name: 'chien fang wang',
                email: 'ddd@dd.cc',
                summaryMoney: 3698
            }
        ];
    }

    listItemOnClick(event: MouseEvent, friend: IFriend) {
        this.$router.push({
            name: ERouterName.friendDetail,
            params: {
                id: friend.id
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.friends {
    &__top {
        position: sticky;
        top: 0;
    }
}
</style>
