const devConfig = require("./config/webpack.config.server.dev");
const prodConfig = require("./config/webpack.config.server.prod");
const adobeIOConfig = require("./config/webpack.config.adobeio");

const isProductionBuild = (process.env.NODE_ENV === 'production');
const isAdobeIO = process.env.ISADOBEIO || false;
let chosenConfig;

if(isAdobeIO){
    chosenConfig = adobeIOConfig;
}else if(isProductionBuild){
    chosenConfig = prodConfig;
}else{
    chosenConfig = devConfig;
}

module.exports = chosenConfig;