<template>
    <v-app id="inspire">
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
                            <v-card-text>
                                <v-form class="d-flex justify-center login__form">
                                    Please Sign in with:
                                    <div id="google-signin"></div>
                                    <!-- <v-text-field
                                        prepend-icon="mdi-account"
                                        name="login"
                                        label="xxx@mail.com"
                                        type="text"
                                    ></v-text-field>
                                    <v-text-field
                                        id="password"
                                        prepend-icon="mdi-lock"
                                        name="password"
                                        label="Password"
                                        type="password"
                                    ></v-text-field> -->
                                </v-form>
                            </v-card-text>
                            <!-- <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    to="/"
                                >Login</v-btn>
                                <div id="google-signin"></div>
                            </v-card-actions> -->
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { ERouterUrl } from '@/router/model';
import { Server, baseUrl } from '../server';
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, namespace } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { LocalStorageHelper, LocalStorageService } from '@/helper';

@Component({
    components: {},
})
export default class Settings extends Vue {
    @Action('setUser')
    setUser: (user: IUser.IUser) => void;

    mounted() {
        (window as any).gapi.load('auth2', this.initSignInV2);
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
            scope: 'profile email',
            width: 240,
            height: 50,
            longtitle: true,
            theme: 'dark',
            onfailure: this.onFailure,
        });

        (window as any).auth2.attachClickHandler(document.getElementById('google-signin'), {}, this.onSignIn);
    }

    public async onSignIn(googleUser: any) {
        let id_token = googleUser.getAuthResponse().id_token;
        let email = googleUser.getBasicProfile().getEmail();
        console.log('token: ' + id_token); // Do not send to your backend! Use an ID token instead.

        let result = await Server.post('/signup-google', {
            email: email,
            name: 'googleDemo',
            googleIdToken: id_token,
        });

        let user: IUser.IUser = result.data.data;
        user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: !!user.photoUrl ? `${baseUrl}/${user.photoUrl}`: undefined
        }

        this.setUser(user);

        LocalStorageService.setItem('user', user)

        this.$router.push(ERouterUrl.home);
    }

    private onFailure(error: any) {
        console.log(error);
    }
}
</script>

<style lang="scss" scoped>
@import '../sass/main';

.login {
    &__form {
        height: 10rem;
    }
}

#google-signin {
    position: absolute;
    top: 50%;
}
</style>
