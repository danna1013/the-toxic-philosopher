export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'autoprefixer': {
      overrideBrowserslist: [
        '> 0.5%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11',
        'Chrome >= 90',
        'Edge >= 90',
        'Firefox >= 88',
        'Safari >= 14',
        'iOS >= 14',
      ],
      grid: 'autoplace',
      flexbox: 'no-2009',
    },
  },
};
