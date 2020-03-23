import preRender from "./prerender";

global.main = ({model, parameters}) => {

    const {wcmMode, requestPath, requestUrl, modelRootUrl} = parameters;

    return new Promise((resolve, reject) => {
        preRender(model, wcmMode, requestPath, requestUrl, modelRootUrl).then((html) => {
            resolve({
                statusCode: 200,
                body: {
                    code: 200,
                    payload: html
                }
            });
        }).catch((error) => {
            reject({
                statusCode: 500,
                body: {
                    code: 500,
                    payload: 'error!' + error
                }
            });
        })
    });

};