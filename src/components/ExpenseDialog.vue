<template>
    <v-dialog
        v-model="isShow"
        persistent
        max-width="600px"
    >
        <v-card>
            <v-form ref="expenseForm">
                <validation-observer
                    ref="expenseObserver"
                    v-slot="{ invalid }"
                >
                    <v-card-title>
                        <span
                            class="headline"
                            v-once
                        >{{ cardTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <span>With you and:</span>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="friends"
                                        rules="required"
                                    >
                                        <v-autocomplete
                                            autofocus
                                            auto-select-first
                                            v-model="selectedFriends"
                                            :items="friends"
                                            item-text="name"
                                            chips
                                            multiple
                                            return-object
                                            label="Friends*"
                                            required
                                            :error-messages="errors"
                                        >
                                            <template v-slot:selection="data">
                                                <v-chip
                                                    v-bind="data.attrs"
                                                    :input-value="data.selected"
                                                    close
                                                    @click="data.select"
                                                    @click:close="remove(data.item)"
                                                >
                                                    <v-avatar left>
                                                        <v-icon
                                                            v-if="!data.item.photoUrl"
                                                            class="grey lighten-1"
                                                            dark
                                                        >
                                                            mdi-account
                                                        </v-icon>
                                                        <v-img
                                                            v-else
                                                            :src="baseUrl + '/' + data.item.photoUrl"
                                                        ></v-img>
                                                    </v-avatar>
                                                    {{ data.item.name }}
                                                </v-chip>
                                            </template>
                                            <template v-slot:item="data">
                                                <template>
                                                    <v-list-item-avatar>
                                                        <v-icon
                                                            v-if="!data.item.photoUrl"
                                                            class="grey lighten-1"
                                                            dark
                                                        >
                                                            mdi-account
                                                        </v-icon>
                                                        <img
                                                            v-else
                                                            :src="baseUrl + '/' + data.item.photoUrl"
                                                        >
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                                    </v-list-item-content>
                                                </template>
                                            </template>

                                        </v-autocomplete>
                                    </validation-provider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="description"
                                        rules="required"
                                    >
                                        <v-text-field
                                            v-model="description"
                                            label="Description*"
                                            required
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="cost"
                                        rules="required|min_value:0.01"
                                    >
                                        <v-text-field
                                            type="number"
                                            v-model="cost"
                                            prefix="$"
                                            label="cost"
                                            required
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="error"
                            text
                            @click="reset"
                        >
                            Reset Form
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            :disabled="invalid"
                            @click="save"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </validation-observer>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { required, min_value } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { IFriend } from '../views/home/friend/model';
import { baseUrl } from '@/server';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
    },
})
export default class ExpenseDialog extends Vue {
    @Prop()
    isShow: boolean = false;
    private _isShow: boolean = false;

    @Prop({
        default: '',
    })
    objectId: string;

    @Prop()
    friends: IFriend[];

    private readonly baseUrl: string = baseUrl;

    private selectedFriends: IFriend[] = [];

    private isLoading: boolean = false;

    private description: string = '';
    private cost: number = 0;

    private get cardTitle(): string {
        return `${!!this.objectId ? 'Edit' : 'Add'} Expense`;
    }

    created() {
        // validate-related
        extend('required', {
            ...required,
            message: '{_field_} can not be empty',
        });
        extend('min_value', {
            ...min_value,
            message: '{_field_} should be larger than 0',
        });
    }

    mounted() {
        this._isShow = this.isShow;
    }

    @Emit('update:isShow')
    changeIsShow(value: boolean) {
        this._isShow = value;
    }

    remove(item: IFriend) {
        const index = (this.selectedFriends || []).findIndex((x) => x.id === item.id);
        if (index >= 0) this.selectedFriends.splice(index, 1);
    }

    save() {
        console.log(this.selectedFriends);
        // this.isLoading = true;
        // FriendService.addFriend$({
        //     email: this.email,
        //     name: this.name,
        // })
        //     .pipe(
        //         finalize(() => {
        //             this.isLoading = false;
        //             this.reset();
        //             this.close();
        //         }),
        //     )
        //     .subscribe({
        //         next: (result) => {
        //             this.$emit('add-friend', result);
        //             this.close();
        //         },
        //         error: (e) => {
        //             this.$emit('error', e);
        //         },
        //     });
    }

    reset() {
        (this.$refs.expenseForm as any).reset();
        (this.$refs.expenseObserver as any).reset();
    }

    close() {
        this.reset();
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
