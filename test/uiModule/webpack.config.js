'use strict'
const path = require('path');

module.exports = {
    entry: {
        main: ['./dist/index.js']
    },
    output: {
        path: path.resolve(__dirname, '../public/js'),
        filename: 'build.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
}