<template>
    <v-dialog
        v-model="isShow"
        persistent
        max-width="600px"
    >
        <v-card>
            <v-form ref="addFriendForm">
                <validation-observer v-slot="{ invalid }">
                    <v-card-title>
                        <span class="headline">Add Friend</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="email"
                                        rules="required|email"
                                    >
                                        <v-text-field
                                            autofocus
                                            v-model="email"
                                            label="Email*"
                                            required
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                        v-model="name"
                                        label="Name"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small>*indicates required field</small>
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
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';

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

    private email: string = '';
    private name: string = '';

    created() {
        // validate-related
        extend('required', {
            ...required,
            message: '{_field_} can not be empty',
        });
        extend('email', {
            ...email,
            message: 'email format invalid',
        });
    }

    mounted() {
        this._isShow = this.isShow;
    }

    @Emit('update:isShow')
    changeIsShow(value: boolean) {
        this._isShow = value;
    }

    save() {
        
    }

    reset() {
        (this.$refs.addFriendForm as any).reset();
        (this.$refs.addFriendForm as any).resetValidation();
    }

    close() {
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
