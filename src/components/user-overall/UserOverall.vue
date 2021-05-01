<template>
    <div>
        <div class="overall d-flex justify-center">
            <span class="mr-auto">Overall, you owe $8,439</span>
            <v-icon
                v-if="showAddFriend"
                @click="showAddFriendDialog"
            >mdi-account-plus</v-icon>
            <v-icon
                v-if="showAddGroup"
                @click="showAddFriendDialog"
            >mdi-account-multiple-plus</v-icon>
        </div>

        <add-friend
            :isShow.sync="isShowAddFriend"
            @add-friend="addFriend"
            @error="error"
        ></add-friend>

        <loading v-if="isLoading"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import AddFriend from './AddFriendDialog.vue';
import Loading from '../Loading.vue';

@Component({
    components: {
        AddFriend,
        Loading,
    },
})
export default class UserOverall extends Vue {
    @Prop({
        default: false,
    })
    showAddFriend: boolean;

    @Prop({
        default: false,
    })
    showAddGroup: boolean;

    private isShowAddFriend: boolean = false;

    private isLoading: boolean = false;

    showAddFriendDialog() {
        this.isShowAddFriend = true;
    }

    addFriend(value) {
        this.$emit('add-friend', value);
    }

    error(e) {
        this.$emit('error', e);
    }
}
</script>

<style lang="scss" scoped>
</style>
