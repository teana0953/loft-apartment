import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#FF9800',
                secondary: '#F57C00',
                accent: '#FF5722',
                error: '#D32F2F',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            },
        },
    },
});
