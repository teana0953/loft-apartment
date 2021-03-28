import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/home/Home.vue';
import { ERouterName, ERouterUrl } from './model';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: ERouterUrl.home,
        redirect: ERouterUrl.friends,
        component: Home,
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
                    default: () => import(/* webpackChunkName: "chunk-friends" */ '../views/home/group/Groups.vue'),
                },
            },
            {
                path: ERouterUrl.activity,
                name: ERouterName.activity,
                components: {
                    default: () => import(/* webpackChunkName: "chunk-friends" */ '../views/home/activity/Activity.vue'),
                },
            },
        ],
    },
    {
        path: ERouterUrl.settings,
        name: ERouterName.settings,
        component: () => import(/* webpackChunkName: "chunk-activity" */ '../views/settings/Settings.vue'),
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

export default router;
