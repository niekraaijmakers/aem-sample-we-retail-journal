import preRender from "./prerender";

global.main = ({model, parameters}) => {

    const {wcmMode, requestPath, requestUrl, modelRootUrl} = parameters;

    return new Promise((resolve, reject) => {
        preRender(model, wcmMode, requestPath, requestUrl, modelRootUrl).then((html) => {
            resolve({
                statusCode: 200,
                body: {
                    payload: html
                }
            });
        }).catch((error) => {
            reject({
                statusCode: 500,
                body: {
                    payload: 'error!' + error
                }
            });
        })
    });

};