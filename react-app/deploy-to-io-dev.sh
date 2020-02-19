npm run build-aem-prod-adobeio

wskdeploy --apihost https://adobeioruntime.net --auth $AIO-AUTHKEY --namespace $AIO-NAMESPACE --manifest manifest.yaml
