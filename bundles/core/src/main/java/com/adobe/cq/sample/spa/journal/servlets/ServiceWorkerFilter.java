package com.adobe.cq.sample.spa.journal.servlets;

import com.day.cq.commons.feed.StringResponseWrapper;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;
import java.io.OutputStream;

@Component(service = Filter.class, property = {
    "sling.filter.scope=REQUEST",
    "sling.filter.pattern=(.*)",
    "service.ranking:Integer=10000"
})
public class ServiceWorkerFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(ServiceWorkerFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Usually, do nothing
    }
    
    @Override
    public final void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException,
            ServletException {
    
        if(servletRequest instanceof SlingHttpServletRequest && servletResponse instanceof SlingHttpServletResponse){
            SlingHttpServletRequest request = (SlingHttpServletRequest) servletRequest;
            SlingHttpServletResponse response = (SlingHttpServletResponse) servletResponse;
    
            //StringResponseWrapper wrapper = new StringResponseWrapper(response);
            
            response.addHeader("cache-control", "max-age=0");
            response.addHeader("Service-Worker-Allowed", "/");
            chain.doFilter(request, response);
        }
     
    }
    
    @Override
    public void destroy() {
        // Usually, do nothing
    }
}