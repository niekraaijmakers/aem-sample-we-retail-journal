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

module.exports = {
    clientLibRoot: resolveApp('../ui.apps/jcr_root/etc/we-retail-journal/clientlibs/site'),
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appDist: resolveApp('dist'),
    serverBuild: resolveApp('serverBuild'),
    serverDist: resolveApp('dist/server'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    preRenderServer: resolveModule(resolveApp, 'src/server/prerender'),
    appServerIndexJs: resolveModule(resolveApp, 'src/server/index'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
    clientLibRelativePath: '/etc/we-retail-journal/clientlibs/site',
    publicPath: '/'
};



module.exports.moduleFileExtensions = moduleFileExtensions;
