/*global process */

import statsFile from '../../../../ui.apps/jcr_root/etc/we-retail-journal/clientlibs/site/stats';

export const webpackBuildStats = statsFile;

export const webpackBuildChunkNames = statsFile.assets
    .map((asset) => asset.name);

export const webpackExistingChunks = new Set(
    Object.entries(statsFile.namedChunkGroups)
        .filter(([, chunkInfo]) => chunkInfo.chunks.length > 0)
        .map(([chunkName]) => chunkName));
