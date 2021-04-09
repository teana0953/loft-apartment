<template>
    <div class="home flex-column">
        <v-navigation-drawer
            v-model="drawer"
            app
        >
            <v-sheet
                color="orange darken-1 white--text"
                class="pa-4"
            >
                <v-avatar
                    class="mb-4"
                    color="grey darken-1"
                    size="64"
                >
                    <img
                        :src="user.photoUrl"
                        alt="user-photo"
                    >
                </v-avatar>

                <div>{{ user.name }}</div>
                <div>{{ user.email }}</div>
            </v-sheet>

            <v-divider></v-divider>

            <v-list>
                <v-list-item-group
                    v-model="selectedItem"
                    color="primary"
                >
                    <v-list-item
                        v-for="(item, index) in listItems"
                        :key="index"
                        @click="listItemClick($event, item)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            color="primary"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>Loft Apartment</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs
                    v-model="tabSelected"
                    align-with-title
                >
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab
                        v-for="item in tabItems"
                        :to="item.url"
                        :key="item.name"
                    >
                        {{ item.name }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <main
            class="home__main"
            flex-grow-1
        >
            <router-view />
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataCenter from '../../store/data-center';
import { concatMap } from 'rxjs/operators';
import { IStoreModel } from '@/store/models';
import { LocalStorageService, ServiceWorkerService } from '@/helper';
import { ERouterUrl } from '@/router/model';
import { IUser } from '@/store/modules/user/models';
import { Server } from '@/server';

@Component({
    components: {},
})
export default class Home extends Vue {
    private drawer: boolean = !this.$vuetify.breakpoint.mobile;

    private user: IUser = this.$store.getters.user;

    // tab
    private tabSelected: number = 0;
    private tabItems = [
        {
            name: 'friends',
            url: ERouterUrl.friends,
        },
        {
            name: 'groups',
            url: ERouterUrl.groups,
        },
        {
            name: 'activity',
            url: ERouterUrl.activity,
        },
    ];

    // nav
    private selectedItem: number = 0;
    private listItems = [
        {
            text: 'Home',
            icon: 'mdi-home',
            url: ERouterUrl.friends,
        },
        {
            text: 'Settings',
            icon: 'mdi-cog',
            url: ERouterUrl.settings,
        },
        {
            text: 'Log out',
            icon: 'mdi-logout',
        },
    ];

    async listItemClick(event, item) {
        if (item.text === 'Log out') {
            try {
                await Server.get('/logout');
            } catch (error) {
                console.log('logout error', error);
            }

            LocalStorageService.removeItem('user');
            this.$router.push(ERouterUrl.login);

            return;
        }

        if (item?.url) {
            let isSameUrl = this.$router.currentRoute.path === item.url;
            if (!isSameUrl) {
                this.$router.push(item.url);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.home {
    height: 100%;

    &__main {
        height: 100%;
    }
}
</style>
