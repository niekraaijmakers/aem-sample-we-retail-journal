import fetch from 'cross-fetch';
import { ModelClient } from '@adobe/cq-spa-page-model-manager';

const FETCH_CONFIG = {
  headers: {
  }
};

/**
 * Custom ModelClient meant to demonstrate how to customize the request sent to the remote server
 */
export class CustomModelClient extends ModelClient {

  /**
   * Fetches a model using the given a resource path
   *
   * @param {string} modelPath - Path to the model
   * @return {*}
   */
  fetch(modelPath) {
    if (!modelPath) {
      let err = 'Fetching model rejected for path: ' + modelPath;
      return Promise.reject(new Error(err));
    }

    // Either the API host has been provided or we make an absolute request relative to the current host
    let url = `${this._apiHost}${modelPath}`;

    return fetch(url, FETCH_CONFIG).then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        let error = new Error('while fetching the model for url: ' + url, response.statusText || response.status);
        error.response = response;

        return Promise.reject(error);
      }
    })
      .catch((error) => console.error(error));
  }
}

export default CustomModelClient;
