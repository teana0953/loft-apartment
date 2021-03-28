<template>
    <div class="home">
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
                ></v-avatar>

                <div>Tina Liang</div>
                <div>john@vuetifyjs.com</div>
            </v-sheet>

            <v-divider></v-divider>

            <v-list>

                <v-list-item
                    v-for="(item, index) in listItems"
                    :key="index"
                    link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            color="primary"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-main>
            Home
        </v-main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataCenter from '../store/data-center';
import { concatMap } from 'rxjs/operators';
import { IStoreModel } from '@/store/models';
import { ServiceWorkerService } from '@/helper';

@Component({
    components: {},
})
export default class Home extends Vue {
    private drawer: boolean = !this.$vuetify.breakpoint.mobile;

    private selectedItem: number = 0;

    private listItems = [
        {
            text: 'Home',
            icon: 'mdi-home'
        },
        {
            text: 'Settings',
            icon: 'mdi-cog'
        },
        {
            text: 'Log out',
            icon: 'mdi-logout'
        }
    ]

}
</script>

<style lang="scss" scoped>
</style>
