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
                "sling.servlet.resourceTypes=we-retail-journal/chunks/ssr-js",
                "sling.servlet.methods=GET"
        }
)
public class DynamicChunkScriptTagPrinter extends SlingSafeMethodsServlet {
    
    public static final String SCRIPT_TAG = "<script type=\"text/javascript\" src=\"%s\"></script>";
    
    @Reference
    private AssetManifestService manifestService;
    
    @Reference
    private SpaPageBindingsProvider bindingsProvider;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse slingResponse) throws ServletException, IOException {
        final PrintWriter writer = slingResponse.getWriter();
    
        try {
            if (bindingsProvider.isServerSideRenderingActiveForRequest()) {
                final SSRResponse response = bindingsProvider.getServerSideRenderedRequestResult();
        
                if (response != null) {
                    writer.append(printScriptTags(response.getPayload(),request));
                }
            }
        } catch (LoginException e) {
            throw new ServletException(e);
        }
        
    }
    
    private String printScriptTags(SSRResponse.Payload payload, SlingHttpServletRequest request) throws IOException, LoginException {
        
        StringBuilder scriptTags = new StringBuilder();
        for (String chunkName : payload.getChunkNames()) {
            
            final Map<String, String> manifestAsMap = manifestService.getManifest(request);
            if(manifestAsMap.containsKey(chunkName + ".js")){
                scriptTags.append("\n");
                scriptTags.append(String.format(SCRIPT_TAG, manifestAsMap.get(chunkName + ".js")));
            }
            
        }
        return scriptTags.toString();
        
    }
    
    
  
    
}
