import { Server } from '../server';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/home/Home.vue';
import { ERouterName, ERouterUrl } from './model';
import { LocalStorageService } from '@/helper';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        name: ERouterName.login,
        path: ERouterUrl.login,
        component: () => import(/* webpackChunkName: "chunk-login" */ '../views/Login.vue'),
    },
    {
        name: ERouterName.home,
        path: ERouterUrl.home,
        redirect: ERouterUrl.friends,
        component: () => import(/* webpackChunkName: "chunk-home" */ '../views/home/Home.vue'),
        meta: {
            loginRequired: true,
        },
        children: [
            {
                path: ERouterUrl.friends,
                name: ERouterName.friends,
                components: {
                    default: () => import(/* webpackChunkName: "chunk-friends" */ '../views/home/friend/Friends.vue'),
                },
            },
            {
                path: ERouterUrl.groups,
                name: ERouterName.groups,
                components: {
                    default: () => import(/* webpackChunkName: "chunk-groups" */ '../views/home/group/Groups.vue'),
                },
            },
            {
                path: ERouterUrl.activity,
                name: ERouterName.activity,
                components: {
                    default: () => import(/* webpackChunkName: "chunk-activity" */ '../views/home/activity/Activity.vue'),
                },
            },
        ],
    },
    {
        path: ERouterUrl.settings,
        name: ERouterName.settings,
        component: () => import(/* webpackChunkName: "chunk-settings" */ '../views/settings/Settings.vue'),
    },
    {
        path: '*',
        redirect: ERouterUrl.home,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {
    let isHomeChild: boolean = to.matched[0].name === ERouterName.home;
    if (isHomeChild && to.name !== ERouterName.login) {
        // check auth
        if (!LocalStorageService.getItem('user')) {
            return next({ path: ERouterUrl.login });
        }

        // https://medium.com/summers-life/cros-express%E7%AB%AF%E7%9A%84%E8%A8%AD%E5%AE%9A-f94c9a3199a1
        try {
            await Server.get('/check-auth');
        } catch (e) {
            if (e.response?.status === 401) {
                return next({ path: ERouterUrl.login });
            }
        }
    }

    next();
});

export default router;
