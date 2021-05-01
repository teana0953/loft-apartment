<template>
    <div>
        <v-app-bar
            app
            color="primary"
            dark
        >
            <v-icon
                v-if="!showGoToLogin"
                class="mr-3"
                @click="goback"
            >mdi-arrow-left</v-icon>

            <v-toolbar-title>Signup</v-toolbar-title>
        </v-app-bar>

        <main>
            <v-container
                class="justify-center"
                fluid
                fill-height
            >
                <validation-observer v-slot="{ invalid }">
                    <form
                        autocomplete="off"
                        @submit.prevent="signup"
                    >
                        <v-card-text class="flex-wrap">
                            <v-row
                                align="center"
                                justify="center"
                            >
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="name"
                                        rules="required"
                                    >
                                        <v-text-field
                                            :autofocus="!showGoToLogin"
                                            v-model="name"
                                            prepend-icon="mdi-account"
                                            label="Name*"
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>

                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <validation-provider
                                        v-slot="{ errors }"
                                        name="email"
                                        rules="required|email"
                                    >
                                        <v-text-field
                                            v-model="email"
                                            prepend-icon="mdi-email"
                                            label="Email*"
                                            :disabled="emailReadonly"
                                            :readonly="emailReadonly"
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>

                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <validation-provider
                                        v-slot="{errors}"
                                        name="password"
                                        rules="required|min:8"
                                    >
                                        <v-text-field
                                            :autofocus="showGoToLogin"
                                            v-model="password"
                                            prepend-icon="mdi-lock"
                                            label="Password*"
                                            type="password"
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>

                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                >
                                    <validation-provider
                                        v-slot="{errors}"
                                        name="passwordConfirm"
                                        :rules="{required: true, password: ['@password']}"
                                    >
                                        <v-text-field
                                            v-model="passwordConfirm"
                                            prepend-icon="mdi-lock"
                                            label="Password Confirm*"
                                            type="password"
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </v-col>

                                <v-col cols="12">
                                    <validation-provider
                                        v-slot="{errors}"
                                        name="photo"
                                        rules="size:10000"
                                    >
                                        <v-file-input
                                            show-size
                                            v-model="photo"
                                            accept="image/png, image/jpeg"
                                            placeholder="Pick an photo"
                                            prepend-icon="mdi-camera"
                                            label="Photo"
                                            :error-messages="errors"
                                        ></v-file-input>
                                    </validation-provider>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                v-if="showGoToLogin"
                                text
                                color="success"
                                @click="gotoLogin"
                            >Go to Login Page</v-btn>
                            <v-btn
                                color="primary"
                                type="submit"
                                :disabled="invalid"
                            >Signup</v-btn>
                        </v-card-actions>
                    </form>
                </validation-observer>

            </v-container>
        </main>
        <v-snackbar
            :timeout="5000"
            v-model="showSignupError"
            absolute
            bottom
            color="error"
            left
            text
        >
            {{ signupErrorMsg }}
        </v-snackbar>

        <loading v-show="isLoading"></loading>
    </div>
</template>

<script lang="ts">
import { ERouterUrl } from '@/router/model';
import { Server, baseUrl } from '../server';
import Loading from '../components/Loading.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { LocalStorageService } from '@/helper';
import { required, digits, email, min, size } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { Subscription } from 'rxjs';
import { AuthService, ISignupWithToken } from '@/services';
import { finalize } from 'rxjs/operators';

interface IConfirmText {
    otherValue: string;
}

@Component({
    components: {
        ValidationProvider,
        ValidationObserver,
        Loading,
    },
})
export default class Settings extends Vue {
    @Action('setUser')
    setUser: (user: IUser.IUser) => void;

    private id: string = undefined;
    private name: string = '';

    private email: string = '';
    private emailReadonly: boolean = false;

    private password: string = '';
    private passwordConfirm: string = '';
    private photo: File = null;

    private invitedToken: string = '';
    private get showGoToLogin(): boolean {
        return !!this.invitedToken;
    }

    private isLoading: boolean = false;

    private showSignupError: boolean = false;
    private signupErrorMsg: string = '';

    private signupSub: Subscription = new Subscription();

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
        extend('min', {
            ...min,
            message: 'the {_field_} length should be at least {length}',
        });
        extend('password', {
            params: ['otherValue'],
            validate: (value, { otherValue }: IConfirmText) => {
                return value === otherValue;
            },
            message: 'password confirmation does not match',
        });
        extend('size', {
            ...size,
            message: (name, schema) => {
                return `${name} should be less than ${Math.round(schema.size / 1000)} MB!`;
            },
        });

        if (this.$route.params?.token) {
            this.invitedToken = this.$route.params.token;
            this.isLoading = true;
            AuthService.getInfoByToken$(this.invitedToken)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe({
                    next: (result) => {
                        let res: ISignupWithToken = result;
                        this.id = res.id;
                        this.email = res.email;
                        this.emailReadonly = true;
                        this.name = res.name;
                    },
                    error: (e) => {
                        this.signupErrorMsg = `${e}`;
                        this.showSignupError = true;
                    },
                });
        }
    }

    mounted() {}

    private signup() {
        this.isLoading = true;

        this.signupSub = AuthService.signup$({
            name: this.name,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
            photo: this.photo,
        })
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe({
                next: (result) => {
                    let user: IUser.IUser = result.data;
                    this.signupSuccess(user, result.token);
                },
                error: (e) => {
                    this.signupErrorMsg = `${e}`;
                    this.showSignupError = true;
                },
            });
    }

    private signupSuccess(user: IUser.IUser, token: string) {
        user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: !!user.photoUrl ? `${baseUrl}/${user.photoUrl}` : undefined,
        };

        this.setUser(user);

        LocalStorageService.setItem('user', user);

        if (!!token) {
            LocalStorageService.setItem('token', token);
        }

        this.$router.push(ERouterUrl.home);
    }

    private goback() {
        this.$router.back();
    }

    private gotoLogin() {
        this.$router.push({ path: ERouterUrl.login });
    }
}
</script>

<style lang="scss" scoped>
</style>
