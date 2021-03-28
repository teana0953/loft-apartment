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
import { IUser } from './store/modules/user';

const userModule = namespace('../store/modules/user');

@Component({})
export default class App extends Vue {
    @Action('setUser')
    setUser: (user: IUser.IUser) => void;

    mounted() {
        this.setUser({
            id: '1',
            name: 'ssss',
            email: 'sss@dd',
            role: 'user',
        });
    }
}
</script>
