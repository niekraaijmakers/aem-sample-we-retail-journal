package com.adobe.cq.sample.spa.journal.chunks;

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

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=we-retail-journal/chunks/static-js",
                "sling.servlet.methods=GET"
        }
)
public class StaticChunkScriptTagPrinter extends SlingSafeMethodsServlet {
    
    public static final String SCRIPT_TAG = "<script type=\"text/javascript\" src=\"%s\"></script>";
    
    @Reference
    private AssetManifestService manifestService;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        final PrintWriter writer = response.getWriter();
    
        try {
            writer.append(printScriptTag(request, "bootstrap.js"));
            writer.append(printScriptTag(request, "site.js"));
        } catch (LoginException e) {
            throw new ServletException(e);
        }
        
    }
    
    private String printScriptTag(SlingHttpServletRequest request, String chunk) throws IOException, LoginException {
        final String pathToChunk = manifestService.getManifest(request).get(chunk);
        return String.format(SCRIPT_TAG, pathToChunk);
    }
    
  
    
}
