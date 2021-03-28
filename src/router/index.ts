import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/home/Home.vue';
import { ERouterName, ERouterUrl } from './model';

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

router.beforeEach((to, from, next) => {
    // let isHomeChild: boolean = to.matched[0].name === ERouterName.home;
    // if (isHomeChild && to.name !== ERouterName.login) {
    //     console.log('!');
    //     return next({ path: ERouterUrl.login });
    // }

    next();
});

export default router;
