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
import React from "react";
import 'cross-fetch/polyfill';

import ReactDOMServer from 'react-dom/server';
import App from "../App";
import { StaticRouter } from "react-router-dom";
import { Constants, EditorContext } from '@adobe/cq-react-editable-components';
import { ModelClient, ModelManager } from '@adobe/cq-spa-page-model-manager';
import {webpackExistingChunks} from './constants/webpackBuildStats';
import {ReportChunks} from "react-universal-component";
import {clearChunks} from 'react-universal-component/server';

/**
 * Renders a valid model to a html stringify
 *
 * @param   {Object} model - the model to render
 * @param   {[type]} pagePath - the pagePath of the current model
 * @param   {[type]} requestUrl - the request url
 * @param   {[type]} requestPath - the request path
 * @param   {[type]} pageModelRootPath - Path to the app root
 * @param   {[type]} isInEditor - Is the app used in the context of the page editor
 * @returns {String} the string serialization of the html output + state
 */
const renderModelToHTMLString = (model, pagePath, requestUrl, requestPath, pageModelRootPath, isInEditor) => {

    require('../ImportComponents');

    clearChunks();
    let rawChunkNames = [];
    const html = ReactDOMServer.renderToString(
        <ReportChunks report={chunkName => rawChunkNames.push(chunkName)}>
            <StaticRouter location={ requestUrl } context={{}}>
                <EditorContext.Provider value={isInEditor}>
                    <App
                        cqChildren={model[Constants.CHILDREN_PROP]}
                        cqItems={model[Constants.ITEMS_PROP]}
                        cqItemsOrder={model[Constants.ITEMS_ORDER_PROP]}
                        cqPath={pageModelRootPath}
                        locationPathname={requestPath}
                    />
                </EditorContext.Provider>
            </StaticRouter>
        </ReportChunks>
    );

    // We are using ' for the string to we need to make sure we are encoding all other '
    let state = {
        rootModel : model,
        rootModelUrl: ModelManager.rootPath,
        pagePath
    };
    let stateStr = JSON.stringify(state);

    const rendered = `${html}
        <script type="application/json" id="__INITIAL_STATE__">
            window.__AEM_STATE__=${stateStr};\\
        </script>`;

    const chunkNames = Array.from(new Set(  rawChunkNames.map((chunk) => String(chunk).replace(/-/g, '/'))
        .filter((chunkName) => webpackExistingChunks.has(chunkName)) ));

    return {
        html: rendered,
        chunkNames: rawChunkNames
    }
};

const preRender = (model, wcmMode, requestPath, requestUrl, modelRootUrl) => {
    return new Promise((resolve, reject) => {

        const isInEditor = wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
        const pagePath = requestPath.replace('.html', '');

        return ModelManager.initialize({path: "/content/we-retail-journal/react/en/", model: model, modelClient: ModelClient}).then((model) => {
             resolve(renderModelToHTMLString(model, pagePath, requestUrl, requestPath, modelRootUrl, isInEditor));
        }).catch((error) => {
            reject(error);
        });
    });
};

export default preRender;
