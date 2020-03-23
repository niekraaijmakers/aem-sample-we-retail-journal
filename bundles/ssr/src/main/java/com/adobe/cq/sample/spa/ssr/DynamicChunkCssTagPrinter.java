package com.adobe.cq.sample.spa.ssr;

import com.adobe.cq.sample.spa.journal.chunks.PrintChunkService;
import com.adobe.cq.sample.spa.ssr.model.SSRResponse;
import com.adobe.cq.sample.spa.ssr.service.SpaPageBindingsProvider;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=we-retail-journal/chunks/ssr-css",
                "sling.servlet.methods=GET"
        }
)
public class DynamicChunkCssTagPrinter extends SlingSafeMethodsServlet {
    
    @Reference
    private SpaPageBindingsProvider bindingsProvider;
    
    @Reference
    private PrintChunkService printChunkService;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse slingResponse) {
        if(bindingsProvider.isServerSideRenderingActiveForRequest()){
            final SSRResponse response = bindingsProvider.getServerSideRenderedRequestResult();
            final SSRResponse.Payload payload = response.getPayload();
            
            if (response != null) {
                for(String chunkName: payload.getChunkNames()) {
                    printChunkService.printCssChunkToResponse(chunkName, request, slingResponse);
                }
            }
        }
    
    }
    
    
    
    
    
}
