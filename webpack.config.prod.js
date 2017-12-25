const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const VENDOR_LIBS = ['react', 'react-dom', 'redux-form', 'react-redux', 'redux'];

module.exports = {
    // context: __dirname + './src',
    entry: {
        bundle: [
            './src/client/index.jsx',
        ],
        vendor: VENDOR_LIBS,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[hash].js',
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: 'file-loader',
                }],
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('css/styles.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
        new HtmlWebpackPlugin({
            template: 'src/templates/index.html',
            favicon: 'src/images/favicon.ico',
        }),
        new WebpackCleanupPlugin({
            preview: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                WEBPACK: true,
            },
        }),
    ],
};
