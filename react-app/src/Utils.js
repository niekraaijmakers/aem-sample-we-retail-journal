/**
 * Extract an id from the cqModel field of given properties
 *
 * @param props     - React.Component props object
 * @returns {string|undefined}
 */
export function extractModelId (path) {
    return path.substr(path.lastIndexOf('/') + 1);
}

export function isIE11Browser(){
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");

    // Detect IE11
    if (msie > 0 || !!window.navigator.userAgent.match(/Trident.*rv:11\./)) {
        return true;
    }

    // Non IE 11 Browser
    return false;
}