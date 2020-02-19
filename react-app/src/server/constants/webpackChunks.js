import {
    webpackBuildChunkNames,
} from './webpackBuildStats';

export const webpackCSSChunks = webpackBuildChunkNames
    .filter((fileName) => /\.css$/.test(fileName))
    .map((fileName) => `/${fileName}`);

export const CSSTags = webpackCSSChunks
    .map((fileName) => `<link rel="stylesheet" href="${fileName}"/>`)
    .join('');
