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
                @click="showCreateGroupDialog"
            >mdi-account-multiple-plus</v-icon>
        </div>

        <add-friend
            :isShow.sync="isShowAddFriend"
            @add-friend="addFriend"
            @error="error"
        ></add-friend>

        <edit-group
            :isShow.sync="isShowGroup"
            :friends="friends"
            @create-group="createGroup"
            @error="error"
        ></edit-group>

        <loading v-if="isLoading"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import AddFriend from './AddFriendDialog.vue';
import EditGroup from './EditGroupDialog.vue';
import Loading from '../Loading.vue';
import { IFriend } from '@/models/user';

@Component({
    components: {
        AddFriend,
        EditGroup,
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

    @Prop()
    friends: IFriend[];

    private isShowAddFriend: boolean = false;

    private isShowGroup: boolean = false;

    private isLoading: boolean = false;

    showAddFriendDialog() {
        this.isShowAddFriend = true;
    }

    addFriend(value) {
        this.$emit('add-friend', value);
    }

    createGroup(value) {
        this.$emit('create-group', value);
    }

    showCreateGroupDialog() {
        this.isShowGroup = true;
    }

    error(e) {
        this.$emit('error', e);
    }
}
</script>

<style lang="scss" scoped>
</style>
