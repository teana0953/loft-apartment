<template>
    <v-app>
        <v-main>
            <v-container
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
                                                prepend-icon="mdi-account"
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
                                        <v-btn
                                            color="primary"
                                            type="submit"
                                            :disabled="invalid"
                                        >Login</v-btn>
                                        <span class="ml-2 mr-2">or</span>
                                        <div id="google-signin"></div>
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
            :value="loginErrorMsg"
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
        (window as any).gapi.load('auth2', this.initSignInV2);
    }

    private async login() {
        this.isLoading = true;

        let result = undefined;
        try {
            result = await Server.post('/login', {
                email: this.email,
                password: this.password,
            });

            let user: IUser.IUser = result.data.data;
            this.loginSuccess(user);
        } catch (e) {
            this.loginErrorMsg = `${e}`;
        } finally {
            this.isLoading = false;
        }
    }

    private loginSuccess(user: IUser.IUser) {
        user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: !!user.photoUrl ? `${baseUrl}/${user.photoUrl}` : undefined,
        };

        this.setUser(user);

        LocalStorageService.setItem('user', user);

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

    private async onSignIn(googleUser: any) {
        let id_token = googleUser.getAuthResponse().id_token;
        let email = googleUser.getBasicProfile().getEmail();
        console.log('token: ' + id_token); // Do not send to your backend! Use an ID token instead.

        let result = await Server.post('/signup-google', {
            email: email,
            name: 'googleDemo',
            googleIdToken: id_token,
        });

        let user: IUser.IUser = result.data.data;
        this.loginSuccess(user);
    }

    private onFailure(error: any) {
        console.log(error);
    }
}
</script>

<style lang="scss" scoped>
</style>
