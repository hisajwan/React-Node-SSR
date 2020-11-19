require('ignore-styles');

// Babel register to use ES6 features
require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react']
});

// Environment selection based node env
require('./config/env');

// Server file including routes
require('./server');
