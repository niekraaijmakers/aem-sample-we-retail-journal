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
                "sling.servlet.resourceTypes=we-retail-journal/chunks/static-css",
                "sling.servlet.methods=GET"
        }
)
public class StaticChunkCssTagPrinter extends SlingSafeMethodsServlet {
    
    public static final String CSS_TAG = "<link rel=\"stylesheet\" href=\"%s\" type=\"text/css\">";
    
  
    @Reference
    private AssetManifestService manifestService;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        final PrintWriter writer = response.getWriter();
        try {
            writer.append(printMainCssTag(request));
        } catch (LoginException e) {
            throw new ServletException(e);
        }
    }
    
    private String printMainCssTag(SlingHttpServletRequest request) throws IOException, LoginException {
        return String.format(CSS_TAG, manifestService.getManifest(request).get("site.css"));
    }
    
    
    
}
