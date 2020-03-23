const devConfig = require("./config/webpack.config.dev");
const prodConfig = require("./config/webpack.config.prod");
const isProductionBuild = (process.env.NODE_ENV === 'production');
let chosenConfig;

if(isProductionBuild){
    chosenConfig = prodConfig;
}else{
    chosenConfig = devConfig;
}

module.exports = chosenConfig;