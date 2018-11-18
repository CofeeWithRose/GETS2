const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts'
        ]
    },
    plugins:[
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname,'src/resources'),
                to: path.resolve(__dirname,'dist/resources'),
            },
            {
                from: path.resolve(__dirname,'src/index.html'),
                to: path.resolve(__dirname,'dist'),
            }
        ]),
    ],
};
