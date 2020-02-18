/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// webpack.config.js

const paths = require('./config/paths');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getStyleLoaders = require('./config/cssloader');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const {StatsWriterPlugin} = require("webpack-stats-plugin");

const useTypeScript = false;
const shouldUseSourceMap = true;
const isTestEnvironment = process.env.NODE_ENV == 'test';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;


module.exports = {
    // Tell webpack to start bundling our app at app/index.js
    entry: paths.appIndexJs,
    // Output our app to the dist/ directory
    output: {
        pathinfo: true,
        path: paths.clientLibRoot,
        filename: 'js/[name].[hash:8].js',
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: 'js/[name].[hash:8].js',
        // This is the URL that app is served from. We use "/" in development.
        publicPath: paths.publicPath
    },
    devServer: {
        contentBase: paths.clientLibRoot,
        compress: true,
        port: 9000,
        historyApiFallback: {
            disableDotRule: true
        }
    },

    devtool: 'eval-cheap-module-source-map',

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: 'bootstrap',
        },
    },
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebook/create-react-app/issues/253
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebook/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: paths.moduleFileExtensions
            .map(ext => `.${ext}`)
            .filter(ext => useTypeScript || !ext.includes('ts')),
        alias: {
            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
            // patch react-dom for HMR
            'react-dom': '@hot-loader/react-dom',
        },
        plugins: [
            // Adds support for installing with Plug'n'Play, leading to faster installs and adding
            // guards against forgotten dependencies and such.
            PnpWebpackPlugin,
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            // We keep translations in public/, so it has to be disabled
        ],
    },
    resolveLoader: {
        plugins: [
            // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
            // from the current package.
            PnpWebpackPlugin.moduleLoader(module),
        ],
    },
    // Tell webpack to run our source code through Babel
    module: {
        strictExportPresence: true,
        rules: [
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [

                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),

                            plugins: [
                                ['react-hot-loader/babel'],
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                                            },
                                        },
                                    },
                                ],
                                ['universal-import'],
                            ],
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                            // Don't waste time on Gzipping the cache
                            cacheCompression: false,
                        },
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use a plugin to extract that CSS to a file, but
                    // in development "style" loader enables hot editing of CSS.
                    // By default we support CSS Modules with the extension .module.css
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        loader: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: false,
                        }),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
                    // using the extension .module.css
                    {
                        test: cssModuleRegex,
                        loader: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: false,
                            modules: true,
                            getLocalIdent: getCSSModuleLocalIdent,
                        }),
                    },
                    // Opt-in support for SASS. The logic here is somewhat similar
                    // as in the CSS routine, except that "sass-loader" runs first
                    // to compile SASS files into CSS.
                    // By default we support SASS Modules with the
                    // extensions .module.scss or .module.sass
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        loader: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: false,
                            },
                            'sass-loader'
                        ),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules, but using SASS
                    // using the extension .module.scss or .module.sass
                    {
                        test: sassModuleRegex,
                        loader: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: false,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                            'sass-loader'
                        ),
                    },
                ],
            }
        ] .concat(isTestEnvironment ? [{
            test: /\.js$/,
            include: paths.appSrc,
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
            },
            enforce: 'post'
        }] : [])


    },

    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new StatsWriterPlugin({
            stats: { publicPath: true, chunkGroups: true },
            fields: ['assetsByChunkName', 'assets', 'hash', 'publicPath', 'namedChunkGroups']
        }),
        // This gives some necessary context to module not found errors, such as
        // the requesting resource.
        new ModuleNotFoundPlugin(paths.appPath),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            "API_HOST": process.env.API_HOST
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: paths.publicPath,
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css',
        })
    ]
};
