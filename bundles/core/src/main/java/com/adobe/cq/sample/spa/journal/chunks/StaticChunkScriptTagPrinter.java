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
import java.util.Map;

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=we-retail-journal/chunks/static-js",
                "sling.servlet.methods=GET"
        }
)
public class StaticChunkScriptTagPrinter extends SlingSafeMethodsServlet {
    
    @Reference
    private PrintChunkService printChunkService;
    
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        printChunkService.printJsChunkToResponse("bootstrap", request, response);
        printChunkService.printJsChunkToResponse("main", request, response);
        printChunkService.printJsChunkToResponse("vendor", request, response);
        printChunkService.printJsChunkToResponse("polyfills", request, response);
    }
    
}
