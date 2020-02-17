'use strict';

const path = require('path');
const fs = require('fs');


const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
                                                fs.existsSync(resolveFn(`${filePath}.${extension}`))
                                               );
    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

const clientLibRelativePath = '/etc/we-retail-journal/clientlibs/site';
const clientLibRoot = resolveApp('../ui.apps/jcr_root' + clientLibRelativePath);

module.exports = {
    clientLibRoot: clientLibRoot,
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appDist: resolveApp('dist'),
    serverBuild: resolveApp('serverBuild'),
    serverDist: resolveApp('dist/server'),
    statsFile: clientLibRoot + '/stats',
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    adobeIOIndex: resolveModule(resolveApp, 'src/server/adobeio'),
    appServerIndexJs: resolveModule(resolveApp, 'src/server/index'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
    clientLibRelativePath: clientLibRelativePath + '/',
    publicPath: clientLibRelativePath,
};



module.exports.moduleFileExtensions = moduleFileExtensions;
