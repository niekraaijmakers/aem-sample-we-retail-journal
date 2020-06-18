/*global process */

import statsFile from '../../../../ui.apps/jcr_root/apps/we-retail-journal/clientlibs/clientlib-site/resources/stats';

export const webpackBuildStats = statsFile;

export const webpackBuildChunkNames = statsFile.assets
    .map((asset) => asset.name);

export const webpackExistingChunks = new Set(
    Object.entries(statsFile.namedChunkGroups)
        .filter(([, chunkInfo]) => chunkInfo.chunks.length > 0)
        .map(([chunkName]) => chunkName));
