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
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const getStyleLoaders = require('./config/cssloader');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const safePostCssParser = require('postcss-safe-parser');

const useTypeScript = false;


const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;


const isTestEnvironment = process.env.NODE_ENV == 'test';
const isAdobeIO =  process.env.ISADOBEIO || false;

const shouldUseSourceMap = !isAdobeIO;

const entryFile = (isAdobeIO === true) ? paths.adobeIOIndex: paths.appServerIndexJs;
module.exports = {
    // Tell webpack to start bundling our app at app/index.js
    entry: entryFile ,
    mode: 'development',
    target: 'node',
    // Output our app to the dist/ directory
    output: {

        filename: (isAdobeIO) ? 'prerender.js': 'server.js',
        path: paths.serverBuild,
        publicPath: paths.clientLibRelativePath,
        libraryTarget: 'commonjs2',
    },
    devServer: {
        contentBase: paths.serverDist,
        compress: true,
        port: 9000,
        historyApiFallback: {
          disableDotRule: true
        }
    },
    // Emit source maps so we can debug our code in the browser
    devtool: (isAdobeIO) ? 'none' : 'inline-module-source-map',

    optimization: {
        minimize: isAdobeIO,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,

                        ascii_only: true,
                    },
                },

                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: shouldUseSourceMap,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: shouldUseSourceMap
                        ? {
                            // `inline: false` forces the sourcemap to be output into a
                            // separate file
                            inline: false,
                            // `annotation: true` appends the sourceMappingURL to the end of
                            // the css file, helping the browser find the sourcemap
                            annotation: true,
                        }
                        : false,
                },
            }),
        ],


    },
    externals: {
        express: true,
        os: true,
        v8: true,
        compression: true,
        cors: true,
        tls: true,
        cluster: true,
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
                            sourceMap: shouldUseSourceMap,
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
                            sourceMap: shouldUseSourceMap,
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
                                sourceMap: shouldUseSourceMap,
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
                                sourceMap: shouldUseSourceMap,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                            'sass-loader'
                        ),
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
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

        // This gives some necessary context to module not found errors, such as
        // the requesting resource.
        new ModuleNotFoundPlugin(entryFile),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            "API_HOST": process.env.API_HOST
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: paths.publicPath,
        }),

        // Output a single chunk at most to make sure all code is loaded on
        // the server side.
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css',
        }),
        new CleanWebpackPlugin([paths.serverBuild])
    ]
};
