module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
            exclude: [/\.map$/],
        },
        manifestOptions: {
            short_name: 'Loft Apartment',
            name: 'Loft Apartment: common used feature',
            description: 'split money, random choose,...',
            icons: [
                {
                    src: './img/icons/android-chrome-192x192.png',
                    type: 'image/png',
                    sizes: '192x192',
                },
                {
                    src: './img/icons/android-chrome-512x512.png',
                    type: 'image/png',
                    sizes: '512x512',
                },
            ],
            start_url: './',
            background_color: '#3367D6',
            display: 'standalone',
            scope: './',
            theme_color: '#3367D6',
            shortcuts: [],
        },
    },

    transpileDependencies: [
      'vuetify'
    ]
};
