<template>
    <v-app>
        <v-main>
            <v-container
                class="container"
                fluid
                fill-height
            >
                <v-layout
                    align-center
                    justify-center
                >
                    <v-flex
                        xs12
                        sm8
                        md4
                    >
                        <v-card class="elevation-12">
                            <v-toolbar
                                dark
                                color="primary"
                            >
                                <v-toolbar-title>Loft Apartment</v-toolbar-title>
                            </v-toolbar>

                            <validation-observer v-slot="{ invalid }">
                                <form
                                    autocomplete="off"
                                    @submit.prevent="login"
                                >
                                    <v-card-text>
                                        Please Sign in with:
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="email"
                                            rules="required|email"
                                        >
                                            <v-text-field
                                                autofocus
                                                v-model="email"
                                                prepend-icon="mdi-email"
                                                label="Email"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </validation-provider>

                                        <validation-provider
                                            v-slot="{errors}"
                                            name="password"
                                            rules="required"
                                        >
                                            <v-text-field
                                                v-model="password"
                                                prepend-icon="mdi-lock"
                                                label="Password"
                                                type="password"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </validation-provider>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-col>
                                            <v-row
                                                align="center"
                                                justify="center"
                                                class="flex-nowrap"
                                            >
                                                <v-btn
                                                    color="primary"
                                                    type="submit"
                                                    :disabled="invalid"
                                                >Login</v-btn>
                                                <span class="ml-2 mr-2">or</span>
                                                <div id="google-signin"></div>

                                            </v-row>
                                            <v-row
                                                align="center"
                                                justify="end"
                                                class="flex-nowrap"
                                            >
                                                <span class="ml-2">or</span>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    dark
                                                    @click="gotoSignup"
                                                >sign up</v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-card-actions>
                                </form>
                            </validation-observer>

                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
        <loading v-if="isLoading"></loading>
        <v-snackbar
            :timeout="5000"
            v-model="showLoginError"
            absolute
            bottom
            color="error"
            left
            text
        >
            {{ loginErrorMsg }}
        </v-snackbar>
    </v-app>
</template>

<script lang="ts">
import { ERouterUrl } from '@/router/model';
import { Server, baseUrl } from '../server';
import Loading from '../components/Loading.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { LocalStorageService } from '@/helper';
import { required, digits, email } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { Subscription } from 'rxjs';
import { AuthService } from '@/services';
import { finalize } from 'rxjs/operators';

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

    private email: string = '';
    private password: string = '';

    private isLoading: boolean = false;
    private loginErrorMsg: string = '';
    private showLoginError = false;

    private loginSub: Subscription = new Subscription();

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
        if (process.env.NODE_ENV === 'production') {
            (window as any).gapi.load('auth2', this.initSignInV2);
        }
    }

    private login() {
        this.isLoading = true;

        this.loginSub = AuthService.login$({
            email: this.email,
            password: this.password,
        })
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe({
                next: (result) => {
                    let user: IUser.IUser = result.data;
                    this.loginSuccess(user, result.token);
                },
                error: (e) => {
                    this.loginErrorMsg = `${e}`;
                    this.showLoginError = true;
                },
            });
    }

    private loginSuccess(user: IUser.IUser, token: string) {
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

    private initSignInV2() {
        (window as any).auth2 = (window as any).gapi.auth2.init({
            client_id: '62727377895-e05nkblb6sp5r333rd04dt9b6fbp27b2.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            scope: 'profile',
        });

        this.renderButton();
    }

    private renderButton() {
        (window as any).gapi.signin2.render('google-signin', {
            scope: 'profile email https://www.googleapis.com/auth/contacts.readonly',
            width: 120,
            height: 36,
            longtitle: false,
            theme: 'dark',
            onfailure: this.onFailure,
        });

        (window as any).auth2.attachClickHandler(document.getElementById('google-signin'), {}, this.onSignIn);
    }

    private onSignIn(googleUser: any) {
        let id_token = googleUser.getAuthResponse().id_token;
        let email = googleUser.getBasicProfile().getEmail();
        let name = googleUser.getBasicProfile().getName();

        AuthService.signupGoogle$({
            email: email,
            name: name,
            googleIdToken: id_token,
        }).subscribe({
            next: (result) => {
                let user: IUser.IUser = result.data;
                this.loginSuccess(user, result.token);
            },
            error: (e) => {
                this.loginErrorMsg = `${e}`;
                this.showLoginError = true;
            },
        });
    }

    private onFailure(error: any) {
        console.log(error);
    }

    private gotoSignup() {
        this.$router.push(ERouterUrl.signup);
    }
}
</script>

<style lang="scss" scoped>
.container {
    overflow: auto;
}
</style>
