import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary:           '#D4AF37',
                background:        '#0A0706',
                surface:           '#3D1E14',
                'on-surface':      '#F4EFEA',
                secondary:         '#6B1515',
                'on-primary':      '#0A0706',
                'surface-container': '#211f1d',
                outline:           '#D4AF37',
                'on-surface-variant':        '#d0c5af',
                'secondary-container':       '#822623',
                'surface-container-highest': '#363531',
                'surface-container-low':     '#1d1b19',
                'outline-variant':           '#4d4635',
                'primary-container':         '#5c4a15',
                'on-secondary-container':    '#ffd9d0',
            },

            borderRadius: {
                DEFAULT: '0px',
                lg:      '0px',
                xl:      '0px',
                full:    '9999px',
            },

            spacing: {
                'section-gap':    '128px',
                'margin-desktop': '64px',
                'unit':           '8px',
                'margin-mobile':  '24px',
                'gutter':         '32px',
                'container-max':  '1440px',
            },

            maxWidth: {
                'container-max': '1440px',
            },

            fontFamily: {
                'body-lg':         ['Lato', ...defaultTheme.fontFamily.sans],
                'headline-lg':     ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
                'display-lg':      ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
                'label-technical': ['"DM Mono"', ...defaultTheme.fontFamily.mono],
                'headline-md':     ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
                'body-md':         ['Lato', ...defaultTheme.fontFamily.sans],
            },

            fontSize: {
                'body-lg':         ['18px', { lineHeight: '28px',  fontWeight: '300' }],
                'headline-lg':     ['48px', { lineHeight: '56px',  fontWeight: '600' }],
                'label-technical': ['12px', { lineHeight: '16px',  letterSpacing: '0.1em', fontWeight: '400' }],
                'display-lg':      ['90px', { lineHeight: '1',     letterSpacing: '-0.02em', fontWeight: '700' }],
                'headline-md':     ['32px', { lineHeight: '40px',  fontWeight: '500' }],
            },
        },
    },

    plugins: [forms],
};
