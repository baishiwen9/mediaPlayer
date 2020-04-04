const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const compName = 'MediaPlayer';

const config = {
    entry: './src/index.js',
    output: {
        filename: 'mediaPlayer.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: compName,
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /(?:src|test)\/.*\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    //useEslintrc: false,
                    envs: ['browser', 'mocha'],
                    globals: ['expect'],
                    failOnWarning: true,
                    failOnError: true,
                },
            },
            {
                test: /(?:src|test)\/.*\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-2']
                    }
                }
            },
            {
                test: /\.(scss|sass|css)$/, 
                loader: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: [
                    {
                      loader: 'css-loader',
                      options: {
                        minimize: true,
                      }
                    },
                    "sass-loader", // compiles Sass to CSS
                    // "postcss-loader",
                  ]
                })
            },
        ],
    },
    // bail: true,
    plugins: [
        new ExtractTextPlugin("mediaPlayer.min.css")
    ]
};


if (JSON.parse(process.env.npm_config_argv).original.join(' ').trim()
    === 'run build') {
    config.devtool = 'cheap-module-source-map';    
    config.plugins.push(
        new UglifyJSPlugin({
            sourceMap: true,
        })
    );
    config.plugins.push(
        new CleanWebpackPlugin(
            [path.resolve(__dirname, 'dist')],　 
            {
              root: path.resolve(__dirname, './'),    　　　　　　　　　　
              verbose: false,    　　　　　　　　　　
              dry:   false    　　　　　　　　　　
            }
          )
    );
}

module.exports = config;