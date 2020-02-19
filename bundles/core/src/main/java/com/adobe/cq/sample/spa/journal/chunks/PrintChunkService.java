package com.adobe.cq.sample.spa.journal.chunks;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;


public interface PrintChunkService {
    
    void printJsChunkToResponse(String chunkName, SlingHttpServletRequest request, SlingHttpServletResponse response);
    void printCssChunkToResponse(String chunkName, SlingHttpServletRequest request, SlingHttpServletResponse response);
    
}
