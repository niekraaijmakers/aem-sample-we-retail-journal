'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = process.env.NODE_ENV;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const isProductionBuild = (process.env.NODE_ENV === 'production');
const isAdobeIo =  process.env.ISADOBEIO || false;
// Ensure environment variables are read.
require('../config/env');

const getWebPackConfigPath = (env) => {
    if(env === 'development'){
        return require('../config/webpack.config.dev');
    }else{
        return require('../config/webpack.config.prod');
    }
};

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = getWebPackConfigPath(process.env.NODE_ENV) ;

const prodServerBuild = isAdobeIo ? '../config/webpack.config.adobeio' : '../config/webpack.config.server.prod';
const devServerBuild = isAdobeIo ?  '../config/webpack.config.adobeio'  : '../config/webpack.config.server.dev';

const serverConfig = (isProductionBuild) ? require(prodServerBuild) : require(devServerBuild);
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
      FileSizeReporter.measureFileSizesBeforeBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([ paths.appIndexJs])) {
    process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);

const runCompiler = (config, previousFileSizes) => new Promise(
    (resolve, reject) => webpack(config).run((err, stats) => {
        let messages;
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            messages = formatWebpackMessages(
                stats.toJson({ all: false, warnings: true, errors: true })
            );
        }

        console.log("passed path",config.output.path);


        if (messages.errors.length) {
            // Only keep the first error. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (messages.errors.length > 1) {
                messages.errors.length = 1;
            }
            return reject(new Error(messages.errors.join('\n\n')));
        }
        if (
            process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                 process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
        ) {
            console.log(
                chalk.yellow(
                    '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
                )
            );
            return reject(new Error(messages.warnings.join('\n\n')));
        }

        const resolveArgs = {
            stats,
            previousFileSizes,
            warnings: messages.warnings,
        };

        return resolve(resolveArgs);
    }));

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
    if(isProductionBuild){
        console.log('Creating an optimized production build...');
    }
    return new Promise( (resolve, reject) => {
        runCompiler(config,previousFileSizes)
            .then(() => runCompiler(serverConfig,previousFileSizes))
            .then(resolve)
            .catch(reject);
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml,
    });
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
let buildResult = checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
        // First, read the current file sizes in build directory.
        // This lets us display how much they changed later.
        return measureFileSizesBeforeBuild(paths.appBuild);
    })
    .then((previousFileSizes) => {
        // Remove all content but keep the directory so that
        // if you're in it, you don't end up in Trash
        fs.emptyDirSync(paths.appBuild);
        // Merge with the public folder
        copyPublicFolder();
        // Start the webpack build
        return build(previousFileSizes);
    })
    .then((buildResults) => buildResults && buildResults.map && buildResults.map((buildResult) => {
        const {stats, previousFileSizes, warnings} = buildResult;

        if (warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                    chalk.underline(chalk.yellow('keywords')) +
                    ' to learn more about each warning.'
            );
            console.log(
                'To ignore, add ' +
                    chalk.cyan('// eslint-disable-next-line') +
                    ' to the line before.\n'
            );
        } else {
            console.log(chalk.green('Compiled successfully.\n'));
        }


        const appPackage = require(paths.appPackageJson);
        const publicUrl = paths.publicUrl;
        const publicPath = config.output.publicPath;
        const buildFolder = path.relative(process.cwd(), paths.appBuild);
        printHostingInstructions(
            appPackage,
            publicUrl,
            publicPath,
            buildFolder,
            useYarn
        );
        return buildResult;
    }),
          (err) => {
              console.log(chalk.red('Failed to compile.\n'));
              printBuildError(err);
              process.exit(1);
              throw err;
          }
         )
    .catch((err) => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
        throw err;
    });

module.exports = {buildResult, default: buildResult};
