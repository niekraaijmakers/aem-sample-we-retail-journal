import 'react-app-polyfill/ie11';
import 'custom-event-polyfill';

import 'core-js/stable';
import 'cross-fetch/polyfill';
import 'url-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import './ImportComponents';
import {BrowserRouter} from 'react-router-dom';

import { ModelClient } from '@adobe/cq-spa-page-model-manager';
import {PathUtils, ModelManager, Constants} from "@adobe/cq-spa-page-model-manager";
import './registerServiceWorker';


const model =
    window.__AEM_STATE__
        ? window.__AEM_STATE__
        : {};

const initialModel = model ? model.rootModel : undefined;

const isServerSideRendered = (initialModel !== undefined);

delete window.__AEM_STATE__;

const baseUrl = PathUtils.getMetaPropertyValue('cq:proxy_aem') ? PathUtils.getMetaPropertyValue('cq:proxy_aem') : '';
const customModelClient = new ModelClient(baseUrl);

const DOMReady = (f) => {/in/.test(document.readyState)?setTimeout( () => DOMReady(f),9):f()}

const preloadPaths = [
    '/content/we-retail-journal/react/en/blog/weather',
    '/content/we-retail-journal/react/en/blog/aboutus'
];

DOMReady( () => {
    ModelManager.initialize({model: initialModel,modelClient: customModelClient}).then( (pageModel) => {
        const App = require('./App').default;
        const Root = (
            <BrowserRouter>
                <App
                    cqChildren={pageModel[Constants.CHILDREN_PROP]}
                    cqItems={pageModel[Constants.ITEMS_PROP]}
                    cqItemsOrder={pageModel[Constants.ITEMS_ORDER_PROP]}
                    cqPath={pageModel[Constants.PATH_PROP]}
                    locationPathname={window.location.pathname}
                />
            </BrowserRouter>
        );

        const rootDiv = document.getElementById('page');

        if(!isServerSideRendered){
            ReactDOM.render(Root, rootDiv);
        }else{
            ReactDOM.hydrate(Root, rootDiv);
        }

        document.body.className += ' ' + 'js';
    });

    setTimeout(()=> {
        preloadPaths.reduce( (previousPromise, nextPath) => {
            return previousPromise.then(() => {
                return ModelManager.getData(nextPath);
            });
        }, Promise.resolve());
    }, 2000);

});