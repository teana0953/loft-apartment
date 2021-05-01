<template>
    <v-dialog
        v-model="isShow"
        max-width="290"
    >
        <v-card>
            <v-card-title class="headline">
                Delete Group
            </v-card-title>

            <v-card-text>
                Do you really want to delete this group?
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    text
                    @click="cancel"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="green darken-1"
                    text
                    @click="confirm"
                >
                    Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { FriendService } from '@/services';
import { finalize } from 'rxjs/operators';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
    },
})
export default class AddFriendDialog extends Vue {
    @Prop()
    private isShow: boolean = false;
    private _isShow: boolean = false;

    mounted() {
        this._isShow = this.isShow;
    }

    @Emit('update:isShow')
    changeIsShow(value: boolean) {
        this._isShow = value;
    }

    reset() {
        (this.$refs.addFriendForm as any).reset();
        (this.$refs.addFriendObserver as any).reset();
    }

    @Emit('confirm')
    confirm() {
        this.changeIsShow(false);
    }

    @Emit('cancel')
    cancel() {
        this.changeIsShow(false);
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
