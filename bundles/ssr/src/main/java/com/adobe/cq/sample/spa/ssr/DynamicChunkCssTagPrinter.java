package com.adobe.cq.sample.spa.ssr;

import com.adobe.cq.sample.spa.journal.chunks.AssetManifestService;
import com.adobe.cq.sample.spa.ssr.model.SSRResponse;
import com.adobe.cq.sample.spa.ssr.service.SpaPageBindingsProvider;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=we-retail-journal/chunks/ssr-css",
                "sling.servlet.methods=GET"
        }
)
public class DynamicChunkCssTagPrinter extends SlingSafeMethodsServlet {
    
    public static final String CSS_TAG = "<link rel=\"stylesheet\" href=\"%s\" type=\"text/css\">";
    
    @Reference
    private SpaPageBindingsProvider bindingsProvider;
    
    @Reference
    private AssetManifestService manifestService;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse slingResponse) throws ServletException, IOException {
        final PrintWriter writer = slingResponse.getWriter();
      
        if(bindingsProvider.isServerSideRenderingActiveForRequest()){
            final SSRResponse response = bindingsProvider.getServerSideRenderedRequestResult();
    
            if (response != null) {
                try {
                    writer.append(printCssTags(response.getPayload(), request));
                } catch (LoginException e) {
                    throw new ServletException("Could not retrieve manifest file!", e);
                }
            }
        }
    
    }
    
    
    private String printCssTags(SSRResponse.Payload payload, SlingHttpServletRequest request) throws IOException, LoginException {
        
        StringBuilder scriptTags = new StringBuilder();
        for(String chunkName: payload.getChunkNames()){
            
            final Map<String, String> manifestAsMap = manifestService.getManifest(request);
            if(manifestAsMap.containsKey(chunkName + ".css")){
                scriptTags.append("\n");
                scriptTags.append(String.format(CSS_TAG, manifestAsMap.get(chunkName +".css")));
            }
            
        }
        return scriptTags.toString();
        
    }
    
    
    
}
