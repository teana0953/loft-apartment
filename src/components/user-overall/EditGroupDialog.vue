<template>
    <v-dialog
        v-model="isShow"
        persistent
        max-width="600px"
    >
        <v-card>
            <v-form ref="groupForm">
                <validation-observer
                    ref="groupObserver"
                    v-slot="{ invalid }"
                >
                    <v-card-title>
                        <span
                            class="headline"
                            v-once
                        >{{ title }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                >
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
                                                    @click:close="removeFriend(data.item)"
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

                                <v-col
                                    cols="12"
                                    sm="6"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="name"
                                        rules="required"
                                    >
                                        <v-text-field
                                            v-model="name"
                                            label="Name*"
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

        <loading v-show="isLoading"></loading>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { required } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { finalize } from 'rxjs/operators';

import Loading from '../Loading.vue';
import { IFriend } from '@/models/user';
import { baseUrl } from '@/server';
import { GroupService } from '@/services';

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
        Loading,
    },
})
export default class EditGroupDialog extends Vue {
    @Prop()
    isShow: boolean = false;
    private _isShow: boolean = false;

    @Prop()
    id: string;
    private get title(): string {
        return !!this.id ? 'Edit Group' : 'Create Group';
    }

    @Prop()
    friends: IFriend[];

    private selectedFriends: IFriend[] = [];

    private name: string = '';

    private readonly baseUrl: string = baseUrl;
    private isLoading: boolean = false;

    created() {
        // validate-related
        extend('required', {
            ...required,
            message: '{_field_} can not be empty',
        });
    }

    mounted() {
        this._isShow = this.isShow;
    }

    @Emit('update:isShow')
    changeIsShow(value: boolean) {
        this._isShow = value;
    }

    removeFriend(item: IFriend) {
        const index = (this.selectedFriends || []).findIndex((x) => x.id === item.id);
        if (index >= 0) this.selectedFriends.splice(index, 1);
    }

    save() {
        let isCreated: boolean = !this.id;

        this.isLoading = true;
        if (isCreated) {
            GroupService.addGroup$({
                name: this.name,
                userIds: this.selectedFriends.map((user) => user.id),
            })
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                        this.reset();
                        this.close();
                    }),
                )
                .subscribe({
                    next: (result) => {
                        this.$emit('create-group', result);
                        this.close();
                    },
                    error: (e) => {
                        this.$emit('error', e);
                    },
                });
        }
    }

    reset() {
        (this.$refs.groupForm as any).reset();
        (this.$refs.groupObserver as any).reset();
    }

    close() {
        this.reset();
        this.changeIsShow(false);
    }
}
</script>

<style lang="scss" scoped>
</style>
