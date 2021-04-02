<template>
    <v-app id="inspire">
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, namespace } from 'vuex-class';
import { LocalStorageService } from './helper';
import { IUser } from './store/modules/user';

const userModule = namespace('../store/modules/user');

@Component({})
export default class App extends Vue {
    @Action('setUser')
    setUser: (user: IUser.IUser) => void;

    mounted() {
        let user = LocalStorageService.getItem('user');
        if (user) {
            this.setUser(user);
        }
    }
}
</script>
