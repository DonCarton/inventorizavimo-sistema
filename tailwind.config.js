import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            screens:{
                '4xl': '2560px',
                '3xl': '1600px',
                '2xl': '1080px',
                'sm': '480px'
            },
            keyFrames: {
                fadeOut: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0},
                },
            },
            animation: {
                fadeOut: 'fadeOut 5s ease-in-out forwards',
            },
        },
    },

    plugins: [forms],
};
