#AdobeIO / SSR / chunking / suspense / aempack demo.

I did not bother to add the license files everywhere yet. Therefore for now use -Drat.skip=true in your builds.

###To build: 

mci -Drat.skip=true  -PautoInstallSinglePackage

With sourcemaps:
mci -Drat.skip=true  -PautoInstallSinglePackage -DreactDevBuild=true


###Adobe IO
For adobe IO , you will need an account and specify the login data in the POM.xml
Then simply run in the root:

mci -Drat.skip=true  -Pdeployio

Or in react-app:

wskdeploy --apihost https://adobeioruntime.net --auth $yourkey --namespace yournamespace --manifest manifest.yaml

To test with AEM, be sure to properly configure SSRRenderingServiceImpl. (use adobeio runmode and configure file)

### AEMPack
For aempack (livereload) scripts to work properly, add to host file:
local.we-retail-journal.com   127.0.0.1

This works well together with sling mappings.

To test the code server side, be sure your SSRRenderingServiceImpl points to localhost and not adobeio.
Then run aempack-ssr or aempack-pub-ssr.

